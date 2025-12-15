import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Crear carpeta de uploads si no existe
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { filename, mimetype, size } = req.file;
    
    console.log(`📁 Archivo subido: ${filename} (${size} bytes)`);

    // Crear la URL del archivo
    const fileUrl = `/uploads/${filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: filename,
      url: fileUrl,
      size,
      mimetype,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error al subir archivo:', error);
    res.status(500).json({ message: 'Failed to upload file', error });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Validar que el filename no contenga path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const filePath = path.join(uploadDir, filename);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    console.log(`📥 Descargando archivo: ${filename}`);

    // Enviar el archivo
    res.download(filePath);
  } catch (error) {
    console.error('❌ Error al descargar archivo:', error);
    res.status(500).json({ message: 'Failed to download file', error });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    // Validar que el filename no contenga path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const filePath = path.join(uploadDir, filename);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Eliminar el archivo
    fs.unlinkSync(filePath);

    console.log(`🗑️  Archivo eliminado: ${filename}`);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('❌ Error al eliminar archivo:', error);
    res.status(500).json({ message: 'Failed to delete file', error });
  }
};
