import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * 捕获子树渲染异常，展示兜底界面并允许重试，避免整页白屏。
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback: Fallback } = this.props;
    if (error) {
      if (Fallback) return <Fallback error={error} reset={this.reset} />;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">页面出现异常</h1>
          <p className="max-w-md text-sm text-text-secondary">{error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      );
    }
    return children;
  }
}
