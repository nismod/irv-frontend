import { GL } from '@luma.gl/webgl/constants';
import { vi } from 'vitest';

export function makeReadbackDevice(type = 'webgl') {
  return {
    type,
    gl: {
      PIXEL_PACK_BUFFER: GL.PIXEL_PACK_BUFFER,
      PIXEL_PACK_BUFFER_BINDING: GL.PIXEL_PACK_BUFFER_BINDING,
      STREAM_READ: GL.STREAM_READ,
      SYNC_GPU_COMMANDS_COMPLETE: GL.SYNC_GPU_COMMANDS_COMPLETE,
      ALREADY_SIGNALED: GL.ALREADY_SIGNALED,
      CONDITION_SATISFIED: GL.CONDITION_SATISFIED,
      TIMEOUT_EXPIRED: GL.TIMEOUT_EXPIRED,
      WAIT_FAILED: GL.WAIT_FAILED,
      canvas: new EventTarget(),
      isContextLost: vi.fn(() => false),
      fenceSync: vi.fn((): object | null => ({})),
      clientWaitSync: vi.fn((): number => GL.ALREADY_SIGNALED),
      deleteSync: vi.fn(),
      getParameter: vi.fn((): object | null => null),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      flush: vi.fn(),
    },
    createBuffer: vi.fn(({ byteLength }: { byteLength: number }) => ({
      byteLength,
      handle: {},
      readAsync: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 255])),
      destroy: vi.fn(),
    })),
  };
}
