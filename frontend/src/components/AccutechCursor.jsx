import { useEffect, useRef } from 'react';
import './AccutechCursor.css';

// Adapted from the reference Cursor component. It stays inside the Accutech 3D area.
export default function AccutechCursor({ rootRef }) {
  const cursorRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    if (!root || !cursor || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    let visible = false;
    let hovered = false;
    const mouse = {x:0,y:0}, pos = {x:0,y:0};
    const onMove = event => {
      const rect = root.getBoundingClientRect();
      visible = event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= Math.max(rect.top,0) && event.clientY <= Math.min(rect.bottom,innerHeight);
      if (visible) {mouse.x = event.clientX; mouse.y = event.clientY;}
      cursor.classList.toggle('acref-cursor-visible',visible);
      const element = event.target instanceof Element ? event.target.closest('a, button, [data-cursor]') : null;
      hovered = !!(element && root.contains(element));
      cursor.classList.toggle('acref-cursor-hover',visible && hovered);
    };
    const onBlur = () => {visible=false;cursor.classList.remove('acref-cursor-visible');};
    const onMouseOut = e => {if(!e.relatedTarget)onBlur();};
    document.addEventListener('pointermove',onMove,{passive:true});
    document.addEventListener('mouseout',onMouseOut);
    window.addEventListener('blur',onBlur);
    const frame = () => {
      // Original uses around 1/6 distance per frame; use time-independent close easing.
      pos.x += (mouse.x-pos.x)*.16;
      pos.y += (mouse.y-pos.y)*.16;
      cursor.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {cancelAnimationFrame(raf);document.removeEventListener('pointermove',onMove);
      document.removeEventListener('mouseout',onMouseOut);window.removeEventListener('blur',onBlur);};
  },[rootRef]);
  return <div className="acref-custom-cursor" ref={cursorRef} aria-hidden="true"/>;
}
