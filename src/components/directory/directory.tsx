import { useEffect, forwardRef, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './directory.scss';
import { staggerText, handleHover, handleHoverExit } from '~/utils/Animations';
// @ts-ignore
const Directory = forwardRef<HTMLInputElement>(({ post }, ref) => {
  let line1 = useRef(null);

  const navigate = useNavigate();

  const onNavigateHandler = (item) => {
    navigate(`/repo/${item}`);
  };
  useEffect(() => {
    staggerText(line1);
  }, []);
  return (
    <div
      ref={ref && ref}
      className='repo-container__box'
      onClick={() => onNavigateHandler(post)}
      aria-hidden
    >
      <h2 className='repo-container__box-border'>
        <div
          onMouseEnter={(e) => handleHover(e)}
          onMouseLeave={(e) => handleHoverExit(e)}
          // @ts-ignore
          ref={(el) => (line1 = el)}
        >
          {post}
        </div>
      </h2>
    </div>
  );
});

Directory.displayName = 'Directory';
export default Directory;
