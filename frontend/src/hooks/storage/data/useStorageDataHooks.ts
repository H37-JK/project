import useSWRMutation from "swr/mutation";
import {deleteFetcher, getFetcher, postFetcher} from "@/lib/axios";
import useSWR from "swr";
import React, {useState} from "react";
import {Storage} from "@/constants/storage";
import {useStorageUIHooks} from "@/hooks/storage/ui/useStorageUIHooks";

const upload_file_url = '/upload/file'
const delete_file_url = '/delete/file'
const update_file_url = '/update/file'
const get_files_url = '/get/files'
const get_file_url = '/get/file'
const proxy_url = '/api/proxy'

export function useStorageDataHooks() {
    const [id, setId] = useState<string | null>('')
    const {alertMessage, setAlertMessage, handleIsShowAlert} = useStorageUIHooks()

    const {data: files, isLoading: filesIsLoading, mutate: filesMutate} = useSWR<Storage[]>(get_files_url, getFetcher)
    const {
        data: file,
        isLoading: fileIsLoading,
        mutate: fileMutate
    } = useSWR<Storage>(id ? `${get_file_url}/${id}` : null, getFetcher)

    const {trigger: uploadTrigger, isMutating: uploadMutating} = useSWRMutation(
        upload_file_url,
        postFetcher, {
            onSuccess: async (data) => {
                await Promise.all([
                    filesMutate(),
                    fileMutate()
                ]);
                if (data.id) setId(data.id)
            }
        }
    )

    const {trigger: deleteTrigger, isMutating: deleteMutating} = useSWRMutation(
        delete_file_url,
        deleteFetcher, {
            onSuccess: async (data) => {
                const updateFiles = await filesMutate()
                await fileMutate()
                if (updateFiles && updateFiles.length > 0) {
                    setId(updateFiles[updateFiles.length - 1].id)
                }
            }
        }
    )

    const fileUploadRequest = async (file: File) => {
        try {
            const data = new FormData()
            data.append('upload_file', file as File)
            await uploadTrigger({
                data
            })
        } catch (error) {
            console.error(error)
        }
    }

    const deleteFileRequest = async () => {
        if (!id) return
        try {
            await deleteTrigger(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleFileOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                alert('이미지 또는 비디오 파일만 업로드 가능합니다.');
                e.target.value = '';
                return;
            }
            await fileUploadRequest(file)
            e.target.value = ''
        }
    }

    const handleDownload = async (fileUrl, fileName) => {
        try {
            fileUrl = `${proxy_url}/${fileUrl.split('/')[fileUrl.split('/').length - 1]}`
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("다운로드 중 에러 발생:", error);
            alert("파일을 다운로드할 수 없습니다.");
        }
    };


    return {
        id, setId,
        files,
        file,
        handleFileOnChange,
        handleDownload,
        fileUploadRequest,
        deleteFileRequest
    }
}