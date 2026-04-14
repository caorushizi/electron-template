import React, { FC, useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { FolderOpen, ExternalLink, MousePointer2 } from "lucide-react";
import { IPC, EVENT } from "@app/preload/channels";
import { Button } from "@/components/ui/button";
import useElectron from "@/hooks/electron";
import { fetcher } from "@/lib/http";
import { useAppStore } from "@/store";

const HomePage: FC = () => {
  const electron = useElectron();
  const [progress, setProgress] = useState<unknown>(null);

  const count = useAppStore((s) => s.count);
  const increase = useAppStore((s) => s.increase);
  const reset = useAppStore((s) => s.reset);

  // swr + axios 示例：命中 GitHub zen 接口，无需后端
  const { data: zen, isLoading } = useSWR<string>(
    "https://api.github.com/zen",
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    const off = electron.on(EVENT.update.downloadProgress, (p) =>
      setProgress(p),
    );
    return off;
  }, [electron]);

  const onOpenFile = async () => {
    try {
      const files = await electron.invoke(IPC.dialog.open, { type: "file" });
      toast.success(files.length ? files.join(", ") : "已取消");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onOpenExternal = () => {
    void electron.invoke(IPC.shell.open, "https://github.com");
  };

  const onShowMenu = async () => {
    const picked = await electron.invoke(IPC.contextMenu.show, [
      { key: "a", label: "Option A" },
      { key: "b", label: "Option B" },
      { type: "separator" },
      { key: "c", label: "Option C" },
    ]);
    toast.info(`picked: ${picked ?? "cancelled"}`);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">IPC demo</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onOpenFile}>
            <FolderOpen /> 打开文件对话框
          </Button>
          <Button variant="secondary" onClick={onOpenExternal}>
            <ExternalLink /> 浏览器打开 github.com
          </Button>
          <Button variant="outline" onClick={onShowMenu}>
            <MousePointer2 /> 弹出原生菜单
          </Button>
        </div>
        {progress != null && (
          <p className="text-muted-foreground text-sm">
            update progress: {JSON.stringify(progress)}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">zustand + immer</h2>
        <div className="flex items-center gap-3">
          <Button onClick={() => increase()}>count +1</Button>
          <Button variant="ghost" onClick={reset}>
            reset
          </Button>
          <span className="text-muted-foreground text-sm">count: {count}</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">swr + axios</h2>
        <p className="text-muted-foreground text-sm">
          {isLoading ? "loading…" : (zen ?? "(empty)")}
        </p>
      </section>
    </div>
  );
};

export default HomePage;
