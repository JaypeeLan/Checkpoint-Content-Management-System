import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, List, ListItem, Stack, TextField, Typography } from '@mui/material';
import { api } from '../api/client';

type PostResult = {
  post_id: number;
  title?: string;
  content?: string;
  excerpt?: string;
};

export default function PostsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async (text: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/search/posts', { params: { q: text } });
      setResults(res.data?.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load posts.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch('');
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="Search posts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={() => runSearch(query)} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {loading ? (
        <Stack direction="row" alignItems="center" gap={1}>
          <CircularProgress size={18} />
          <Typography variant="body2">Loading posts...</Typography>
        </Stack>
      ) : (
        <List>
          {results.map((item) => (
            <ListItem key={item.post_id}>
              <Box>
                <Typography variant="subtitle1">{item.title || 'Untitled'}</Typography>
                <Typography variant="body2">
                  {(item.excerpt || item.content || '').slice(0, 220)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}