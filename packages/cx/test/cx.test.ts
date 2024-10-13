import { describe, it, expect, vi, SpyInstance, beforeEach, afterEach, Mock } from 'vitest';
import child_process from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { run } from '../src/executor';

// Mock fs and child_process modules
vi.mock('fs');
vi.mock('child_process');

describe('CommandExecutor', () => {
  let mockSpawn: Mock;

  beforeEach(() => {
    // Mock fs.existsSync to always return true
    vi.mocked(fs.existsSync).mockReturnValue(true);

    // 重置并重新模拟 spawn
    mockSpawn = vi.fn().mockReturnValue({
      on: vi.fn((event, handler) => {
        if (event === 'close') {
          // 模拟异步操作
          setTimeout(() => handler(0), 0);
        }
        return mockSpawn.mock.results[0].value; // 返回 ChildProcess 对象以支持链式调用
      }),
    });
    vi.mocked(child_process.spawn).mockImplementation(mockSpawn);
    vi.mocked(fs.existsSync).mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute shell command in the specified directory', async () => {
    const _dir = process.cwd()
    await run(['ls', '-la'], { cwd: './test-project', shell: '/bin/sh' });

    expect(mockSpawn).toHaveBeenCalledWith('ls', ['-la'], expect.objectContaining({
      cwd: path.resolve(_dir, 'test-project'),
      shell: "/bin/sh",
      stdio: "inherit",
    }));
  });

  it('should throw an error if the directory does not exist', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    await expect(run(['install'], { cwd: './non-existent' }))
      .rejects.toThrow('Directory not found');
  });

  it('should restore the original directory after execution', async () => {
    const originalCwd = process.cwd();
    await run(['install'], { cwd: './test-project' });

    expect(process.cwd()).toBe(originalCwd);
  });

  it('should handle command execution failure', async () => {
    vi.mocked(child_process.spawn).mockReturnValue({
      on: vi.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(1); // Simulate command execution failure
        }
      }),
    } as any);

    await expect(run(['failing-command']))
      .rejects.toThrow('Command failed with exit code 1');
  });
});
