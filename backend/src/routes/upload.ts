import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, downloadFile, deleteFile } from '../controllers/uploadController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// Configurar multer para almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Permitir tipos de archivo específicos
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  }
});

const router = Router();

router.use(authMiddleware);

// POST: Subir archivo
router.post('/upload', upload.single('file'), uploadFile);

// GET: Descargar archivo
router.get('/download/:filename', downloadFile);

// DELETE: Eliminar archivo
router.delete('/delete/:filename', deleteFile);

export default router;
