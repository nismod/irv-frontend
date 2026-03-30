interface DownloadFileBlob {
  content: Blob;
  filename: string;
}
interface DownloadFileString {
  content: string;
  mimeType: string;
  filename: string;
}

export type DownloadFile = DownloadFileBlob | DownloadFileString;
