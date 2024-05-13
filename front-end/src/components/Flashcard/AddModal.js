import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AddModal() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [isHovered, setIsHovered] = React.useState(false);
  const [folders, setFolders] = React.useState([{}]);

  const user_id = localStorage.getItem("user_id");
  const set_id = localStorage.getItem("set_id");

  React.useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");
      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error("Token không tồn tại trong localStorage");
      } else {
        try {
          // Thực hiện gọi API ở đây
          const response = await axios.get(
            `http://localhost:8080/api/folder/${user_id}/folders?size=1000`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFolders(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách các folder:", error.message);
        }
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddSet = async (folder_id) => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.post(
          `http://localhost:8080/api/folder-set/create-folder-set`,
          {
            folder_id: folder_id,
            set_id: set_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Thêm folder thành công!");
      } catch (error) {
        toast.error("Set đã tồn tại trong folder này!");
      }
    }
  };

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Toaster />
      <Button
        style={{
          padding: "10px !important",
          alignItems: "flex-end !important",
          fontSize: "14px",
          cursor: "pointer",
          backgroundColor: isHovered ? "lighten($color: #101539, $amount: 10%)" : "",
          transition: "background-color 0.3s ease",
          textTransform: 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickOpen("paper")}
      >
        <AddIcon
          style={{
            padding: "10px !important",
            alignItems: "flex-end !important",
            fontSize: "20px",
            cursor: "pointer",
            border: "2px solid #586380",
            borderRadius: "100px",
            backgroundColor: isHovered ? "#282E3E" : "", // Màu nền sẽ thay đổi khi hover
            transition: "background-color 0.3s ease", // Thêm transition cho hiệu ứng màu nền
          }} />
        <span>Thêm vào thư mục</span>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            backgroundColor: "#2E3856",
            color: "#FFFFFF",
          }}
        >
          Thêm học phần
        </DialogTitle>
        <DialogContent
          dividers={scroll === "paper"}
          style={{
            backgroundColor: "#2E3856",
            scrollbarColor: "#586380 #2E3856",
          }}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            style={{
              backgroundColor: "#2E3856",
              color: "#FFFFFF",
            }}
          >
            {folders && folders.map((folder) => (
              <div
                style={{
                  backgroundColor: "#282E3E",
                  color: "#FFFFFF",
                  width: "400px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              >
                <span>{folder.title}</span>
                <Button
                  style={{ color: "white" }}
                  onClick={() => handleAddSet(folder.folderId)}
                >
                  Thêm
                </Button>
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
