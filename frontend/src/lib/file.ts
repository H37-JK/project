export const formatBytesToHumanReadable = (bytesValue: any) => {
    if (bytesValue === null || bytesValue === undefined) {
        return "N/A";
    }

    const numBytes = parseFloat(bytesValue);

    if (isNaN(numBytes)) {
        return "N/A";
    }

    const KB = 1024;
    const MB = KB * 1024;

    if (numBytes < KB) {
        return `${numBytes.toFixed(2)} Bytes`;
    } else if (numBytes < MB) {
        return `${(numBytes / KB).toFixed(2)} KB`;
    } else {
        return `${(numBytes / MB).toFixed(2)} MB`;
    }
};
