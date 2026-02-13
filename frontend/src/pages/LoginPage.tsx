import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginWithPassword, routeForRole } from '../api/auth';
import { getApiErrorMessage } from '../utils/apiError';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@educms.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const role = await loginWithPassword(email, password);
      navigate(routeForRole(role));
    } catch (e) {
      setError(getApiErrorMessage(e, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <Card sx={{ width: 420, maxWidth: '100%' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">EduCMS Login</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button variant="contained" onClick={onSubmit} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Typography variant="body2">
              No account?{' '}
              <Link component={RouterLink} to="/register" underline="hover">
                Create one
              </Link>
            </Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}