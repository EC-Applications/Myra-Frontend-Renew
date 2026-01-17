import { File, FileText, ImageIcon, Table } from "lucide-react";

export const getFileIcon = (docType: string) => {
  if (docType.includes("pdf")) {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  if (docType.includes("image")) {
    return <ImageIcon className="h-4 w-4 text-blue-500" />;
  }
  if (docType.includes("sheet") || docType.includes("excel")) {
    return <Table className="h-4 w-4 text-green-500" />;
  }
  if (docType.includes("document") || docType.includes("word")) {
    return <FileText className="h-4 w-4 text-blue-600" />;
  }
  return <File className="h-4 w-4 text-muted-foreground" />;
};