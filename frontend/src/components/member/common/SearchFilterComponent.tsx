import { ReactNode, useRef, useEffect } from "react";
import styles from "@/styles/member/SearchFilter.module.css";
import { useLocale } from "@/hooks/useLocale";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  toggleFilter: () => void;
  children: ReactNode;
}

const SearchFilterComponent: React.FC<Props> = ({ isOpen, toggleFilter, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { texts } = useLocale();
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : "0px";
    }
  }, [isOpen]);

  return (
    <div className={styles.searchContainer}>
      {!isOpen && (
        <button onClick={toggleFilter} className={styles.toggleButton}>
          {texts.label.open_search_joken} <ExpandMoreIcon></ExpandMoreIcon>
        </button>
      )}
      {isOpen && (
        <button onClick={toggleFilter} className={styles.closeButton}>
          <CloseIcon />
        </button>
      )}
      <div ref={contentRef} className={`${styles.filterSection} ${isOpen ? styles.open : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default SearchFilterComponent;
