import CustomCursor from "@/components/custom-cursor";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import CursorSelectImage from "@/assets/Cinnamoroll Normal Select.png";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* <CustomCursor
        cursorImages={{
          default: CursorSelectImage
        }}
      /> */}
      <Outlet />
    </>
  ),
});
