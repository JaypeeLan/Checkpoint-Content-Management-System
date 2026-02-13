import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { api } from '../api/client';
import { getApiErrorMessage } from '../utils/apiError';

export default function MediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const upload = async () => {
    if (!file || loading) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const signRes = await api.post('/media/signature', {
        filename: file.name
      });

      const sig = signRes.data.data;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', String(sig.timestamp));
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);
      formData.append('public_id', sig.publicId);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const payload = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(payload.error?.message || 'Cloudinary upload failed');
      }

      setSuccess(`Uploaded successfully: ${payload.secure_url}`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Upload failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Media Manager (Cloudinary)</Typography>
      <Stack spacing={2}>
        <TextField
          type="file"
          onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)}
          fullWidth
        />
        <Box>
          <Button variant="contained" onClick={upload} disabled={!file || loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
        {loading ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography variant="body2">Uploading file...</Typography>
          </Stack>
        ) : null}
        {success ? <Alert severity="success">{success}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Stack>
    </Box>
  );
}