import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Link } from "gatsby";

type ProjectLink = {
  title: string;
  path: string;
};

export default function MenuPopupState({ LinkArray } : {LinkArray : ProjectLink[]}) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            Project
          </Button>
          <Menu {...bindMenu(popupState)}>
            {LinkArray.map((item, idx) => {
              return (
                <MenuItem key={idx} onClick={popupState.close}>
                  <Link to={item.path}>{item.title}</Link>
                </MenuItem>
              );
            })}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
