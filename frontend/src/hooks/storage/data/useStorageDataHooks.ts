import useSWRMutation from "swr/mutation";
import {getFetcher, postFetcher} from "@/lib/axios";
import useSWR from "swr";
import React, {useState} from "react";

const upload_file_url = '/upload/file'
const delete_file_url = '/delete/file'
const update_file_url = '/update/file'
const get_files_url = '/get/files'
const get_file_url = '/get/file'
import {Storage} from "@/constants/storage";

export function useStorageDataHooks() {
    const [id, setId] = useState<string | null>('')
    const { data: files, isLoading: filesIsLoading, mutate: filesMutate  } = useSWR<Storage[]>(get_files_url, getFetcher)
    const { data: file, isLoading: fileIsLoading, mutate: fileMutate  } = useSWR<Storage>(id ? `${get_file_url}/${id}` : null,  getFetcher)

    const { trigger: uploadTrigger, isMutating: uploadMutating } = useSWRMutation (
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

    const fileUploadRequest = async (file: File) => {
        try {
            const data = new FormData()
            data.append('upload_file', file as File)
            await uploadTrigger ({
                data
            })
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
        }

    }

    return {
        id, setId,
        files,
        file,
        handleFileOnChange,
        fileUploadRequest
    }
}