import React from "react";
import { Shield, Server, Code, GraduationCap, FolderGit2, Award } from "lucide-react";
import { TimelineCategory } from "../../types";

interface Props {
  category: TimelineCategory;
}

export const TimelineIcon: React.FC<Props> = ({ category }) => {
  const size = 18;

  switch (category) {
    case "security":
      return <Shield size={size} />;
    case "backend":
      return <Server size={size} />;
    case "development":
      return <Code size={size} />;
    case "education":
      return <GraduationCap size={size} />;
    case "project":
      return <FolderGit2 size={size} />;
    case "certificate":
      return <Award size={size} />;
    default:
      return <Code size={size} />;
  }
};
