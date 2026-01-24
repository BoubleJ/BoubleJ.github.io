import { IGatsbyImageData, GatsbyImage } from "gatsby-plugin-image";
import * as styles from "./ProfileImage.css";

interface ProfileImageProps {
  profileImage: IGatsbyImageData;
}

function ProfileImage({ profileImage }: ProfileImageProps) {
  return (
    <GatsbyImage
      image={profileImage}
      alt="Profile Image"
      className={styles.profileImageWrapper}
    />
  );
}

export default ProfileImage;
