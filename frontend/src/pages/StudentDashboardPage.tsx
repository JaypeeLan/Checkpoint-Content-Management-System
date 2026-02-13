import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { api } from '../api/client';

type Post = {
  post_id: number;
  title: string;
  status: string;
};

type Comment = {
  comment_id: number;
  post_id: number;
  post_title?: string;
  content: string;
  status: string;
};

export default function StudentDashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | ''>('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const publishedPosts = useMemo(
    () => posts.filter((post) => post.status === 'published' || post.status === 'draft' || post.status === 'archived'),
    [posts]
  );

  const loadPosts = async () => {
    setLoadingPosts(true);
    setErrorMessage('');
    try {
      const res = await api.get('/posts');
      const data = (res.data?.data || []) as Post[];
      setPosts(data);
      if (data.length && selectedPostId === '') {
        setSelectedPostId(data[0].post_id);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load posts.');
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    setErrorMessage('');
    try {
      const res = await api.get('/comments');
      setComments((res.data?.data || []) as Comment[]);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load comments.');
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadComments();
  }, []);

  const submitComment = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedPostId) {
      setErrorMessage('Select a post before submitting a comment.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Comment content is required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/comments', {
        post_id: selectedPostId,
        content: content.trim()
      });
      setContent('');
      setSuccessMessage('Comment submitted successfully. It may require approval.');
      await loadComments();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Student Dashboard</Typography>
      <Typography variant="body1">Select a post and submit your comment.</Typography>

      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Post a Comment</Typography>

            {loadingPosts ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={18} />
                <Typography variant="body2">Loading posts...</Typography>
              </Box>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="post-select-label">Post</InputLabel>
                <Select
                  labelId="post-select-label"
                  label="Post"
                  value={selectedPostId}
                  onChange={(e) => setSelectedPostId(Number(e.target.value))}
                >
                  {publishedPosts.map((post) => (
                    <MenuItem key={post.post_id} value={post.post_id}>
                      #{post.post_id} - {post.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              label="Comment"
              multiline
              minRows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here..."
            />

            <Box>
              <Button variant="contained" onClick={submitComment} disabled={submitting || loadingPosts || !publishedPosts.length}>
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Recent Comments</Typography>
          <Divider sx={{ my: 1 }} />
          {loadingComments ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} />
              <Typography variant="body2">Loading comments...</Typography>
            </Box>
          ) : (
            <List>
              {comments.slice(0, 20).map((comment) => (
                <ListItem key={comment.comment_id} disableGutters>
                  <Stack>
                    <Typography variant="body1">{comment.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.post_title ? `${comment.post_title} ` : `Post #${comment.post_id} `}| Status: {comment.status}
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}