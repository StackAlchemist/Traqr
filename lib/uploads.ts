import { api } from "./api"

export const uploadFiles = async (files: any[])=>{
    const formData = new FormData()

    files.forEach(( file )=>{
        formData.append("files", {
            uri: file.uri,
            type: file.mimeType,
            name: file.name,
        } as any)
    })

    const response = await api.post(
        "/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      return response.data;

}