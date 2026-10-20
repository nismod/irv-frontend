import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { SystemCssProperties } from '@mui/system';
import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
  message: string;
  // SystemCssProperties<Theme> describes the style properties supported in sx
  justifyErrorContent?: SystemCssProperties<Theme>['justifyContent'];
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {}
  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 1,
          }}
        >
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: this.props.justifyErrorContent,
                gap: 1,
              }}
            >
              <ErrorOutlined />
              <Typography>{this.props.message}</Typography>
            </Stack>
            {process.env.NODE_ENV === 'development' && (
              <Box
                sx={{
                  maxWidth: 'min(100%,700px)',
                  alignSelf: 'center',
                }}
              >
                <Paper>
                  <Box
                    sx={{
                      p: 1,
                      maxWidth: '100%',
                      overflow: 'scroll',
                    }}
                  >
                    <pre>
                      <code>
                        {this.state.error?.stack.toString() ?? this.state.error.toString()}
                      </code>
                    </pre>
                  </Box>
                </Paper>
              </Box>
            )}
          </Stack>
        </Box>
      );
    }
    return this.props.children;
  }
}
