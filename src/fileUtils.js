// utils/fileUtils.js
export const getFileType = (uri, name = '') => {
    const extension = (name || uri).split('.').pop().toLowerCase();
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    }
    
    // Document types
    const documentTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      rtf: 'application/rtf',
      csv: 'text/csv',
    };
    
    if (documentTypes[extension]) {
      return documentTypes[extension];
    }
    
    // Default to octet-stream if type is unknown
    return 'application/octet-stream';
  };