import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import './AccutechCharacterHero.css';
import AccutechCursor from './AccutechCursor';

gsap.registerPlugin(ScrollTrigger);

const typingBones = ['thighL','thighR','shinL','shinR','forearmL','forearmR','handL','handR','f_pinky03R','f_pinky02L','f_pinky02R','f_pinky01L','f_pinky01R','palm04L','palm04R','f_ring01L','thumb01L','thumb01R','thumb03L','thumb03R','palm02L','palm02R','palm01L','palm01R','f_index01L','f_index01R','palm03L','palm03R','f_ring02L','f_ring02R','f_ring01R','f_ring03L','f_ring03R','f_middle01L','f_middle02L','f_middle03L','f_middle01R','f_middle02R','f_middle03R','f_index02L','f_index03L','f_index02R','f_index03R','thumb02L','f_pinky03L','upper_armL','upper_armR','thumb02R','toeL','heel02L','toeR','heel02R'];
async function decryptCharacter(signal) {
  const url = `${import.meta.env.BASE_URL}models/character.enc`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Model not found at ${url}. Copy character.enc from the original repo into public/models/`);
  const bytes = await response.arrayBuffer();
  const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('Character3D#@'));
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']);
  const data = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(bytes.slice(0, 16)) }, key, bytes.slice(16));
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  try { return await new Promise((resolve, reject) => loader.parse(data, '', resolve, reject)); }
  finally { draco.dispose(); }
}
function setupMixer(gltf) {
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clip = name => THREE.AnimationClip.findByName(gltf.animations, name);
  for (const name of ['key1','key2','key5','key6']) {
    const c = clip(name); if (c) { const a=mixer.clipAction(c);a.timeScale=1.2;a.play(); }
  }
  const typing=clip('typing');
  if (typing) {
    const filtered=typing.tracks.filter(t=>typingBones.some(b=>t.name.includes(b)));
    if(filtered.length){const a=mixer.clipAction(new THREE.AnimationClip('typing_filtered',typing.duration,filtered));a.timeScale=1.2;a.play();}
  }
  const intro=clip('introAnimation');
  if(intro){const a=mixer.clipAction(intro);a.setLoop(THREE.LoopOnce,1);a.clampWhenFinished=true;a.play();}
  const blink=clip('Blink');if(blink)mixer.clipAction(blink).play();
  return mixer;
}
function splitIntoCharacters(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const chars = [];
  for (const node of nodes) {
    if (!node.textContent?.trim()) continue;
    const fragment = document.createDocumentFragment();
    const parts = node.textContent.match(/\S+|\s+/g) || [];
    for (const part of parts) {
      if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(part)); continue; }
      const word = document.createElement('span');
      word.className = 'acref-fx-word';
      for (const letter of Array.from(part)) {
        const char = document.createElement('span');
        char.className = 'acref-fx-char';
        char.textContent = letter;
        word.appendChild(char);
        chars.push(char);
      }
      fragment.appendChild(word);
    }
    node.parentNode.replaceChild(fragment, node);
  }
  return chars;
}

function usePortfolioTextFX(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Keep readable text as whole paragraphs. Only split headline letters.
      const titleEls = root.querySelectorAll(
        '.acref-left > span, .acref-left h1, .acref-right > .acref-business-kicker, .acref-service-item h2'
      );
      const titleChars = Array.from(titleEls).flatMap(splitIntoCharacters);
      gsap.fromTo(titleChars,
        { autoAlpha: 0, y: 26, filter: 'blur(3px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65,
          stagger: 0.012, ease: 'power3.out', delay: 0.12, overwrite: 'auto' }
      );

      gsap.fromTo(root.querySelector('.acref-hero-description'),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'power2.out' }
      );
      gsap.fromTo(root.querySelectorAll('.acref-service-item p'),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.15, delay: 0.5, ease: 'power2.out' }
      );

      // Animate about copy when this section enters the viewport.
      gsap.fromTo(root.querySelectorAll('.acref-about-copy > h3, .acref-about-copy > p'),
        { autoAlpha: 0, y: 35 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.16, ease: 'power2.out',
          scrollTrigger: { trigger: '.acref-about-copy', start: 'top 88%',
            toggleActions: 'play none none reverse' } }
      );
      const whatTitle = root.querySelector('.acref-what-title h2');
      if (whatTitle) {
        gsap.fromTo(whatTitle,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: whatTitle, start: 'top 88%',
              toggleActions: 'play none none reverse' } }
        );
      }
    }, root);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(id); ctx.revert(); };
  }, [rootRef]);
}

/**
 * Friendly corporate avatar preset for the ORIGINAL RIGGED GLB.
 * This changes material finish and brow posture, not the mesh topology.
 * To reproduce a completely different sculpted face/haircut, supply a newly
 * rigged .glb using matching skeleton/animation names.
 */
function createFriendlyFacePreset(character) {
  const hair = character.getObjectByName('hair');
  const browsMesh = character.getObjectByName('Eyebrow');
  const eyesMesh = character.getObjectByName('EYEs.001');
  const browBones = [
    character.getObjectByName('eyebrow_L'),
    character.getObjectByName('eyebrow_R'),
  ].filter(Boolean);

  // Clone materials so other scene meshes are unaffected.
  function finishMesh(mesh, options) {
    if (!mesh?.isMesh) return;
    const customize = (material) => {
      const next = material.clone();
      if ('roughness' in next) next.roughness = options.roughness;
      if ('metalness' in next) next.metalness = options.metalness ?? 0;
      if (options.color && next.color) next.color.set(options.color);
      next.needsUpdate = true;
      return next;
    };
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(customize) : customize(mesh.material);
  }
  finishMesh(hair, { roughness: 0.27, metalness: 0.05 });
  finishMesh(browsMesh, { roughness: 0.62 });
  finishMesh(eyesMesh, { roughness: 0.18 });

  // Keep brow alterations subtle; avoid altering the typing / Blink clips.
  const brows = browBones.map((bone, i) => ({
    bone,
    side: i === 0 ? 1 : -1,
    rest: null,
  }));

  return {
    restore() {
      // Always restore the unmodified animated pose before the next mixer update.
      for (const b of brows) if (b.rest) b.bone.quaternion.copy(b.rest);
    },
    apply() {
      for (const b of brows) {
        b.rest = b.bone.quaternion.clone();
        // A minimal outward lift softens the original stern-looking brow pose.
        b.bone.rotateZ(b.side * 0.045);
      }
    },
  };
}

function ThreeCharacter({ sectionRef }) {
  const hostRef=useRef(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    const root=sectionRef.current,host=hostRef.current;
    if(!root||!host)return;
    const mobileView = window.matchMedia('(max-width: 760px)').matches;
    const controller=new AbortController();
    let dead=false,raf=0,renderer=null,resizeObserver=null,mixer=null;

    const pointer={targetX:0,targetY:0,x:0,y:0};
    let pointerPivot=null, headBone=null, previousBaseQuaternion=null, friendlyFace=null;
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLandingVisible=()=>{
      const landing=root.querySelector('.acref-landing');
      if(!landing)return false;
      const r=landing.getBoundingClientRect();
      return r.top<=window.innerHeight*0.35 && r.bottom>window.innerHeight*0.65;
    };
    const onPointerMove=e=>{
      if(mobileView || reducedMotion || e.pointerType==='touch' || !isLandingVisible()){
        pointer.targetX=0;
        pointer.targetY=0;
        return;
      }
      const bounds=root.getBoundingClientRect();
      if(e.clientX<bounds.left || e.clientX>bounds.right){
        pointer.targetX=0;
        pointer.targetY=0;
        return;
      }
      pointer.targetX=THREE.MathUtils.clamp((e.clientX/window.innerWidth-.5)*2,-1,1);
      pointer.targetY=THREE.MathUtils.clamp((e.clientY/window.innerHeight-.5)*2,-1,1);
    };
    const onPointerLeave=()=>{pointer.targetX=0;pointer.targetY=0;};
    window.addEventListener('pointermove',onPointerMove,{passive:true});
    window.addEventListener('blur',onPointerLeave);
    const clock=new THREE.Clock();
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(14.5,1,.1,1000);
    camera.position.set(0, mobileView ? 12.9 : 12.45, mobileView ? 68 : 24.7);
    camera.zoom=mobileView ? 0.85 : 1.1;
    camera.updateProjectionMatrix();
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}
    catch(e){setError(`WebGL unavailable: ${e.message}`);return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
    host.appendChild(renderer.domElement);
    const ambient=new THREE.AmbientLight(0xffffff,1.65);scene.add(ambient);
    const key=new THREE.DirectionalLight(0xc7a9ff,2.5);key.position.set(-0.47,-0.32,-1);scene.add(key);
    const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(4,16,7);scene.add(fill);
    const point=new THREE.PointLight(0xc2a4ff,12,100,3);point.position.set(3,12,4);scene.add(point);
    function resize(){if(!host.isConnected)return;const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
    function frame(){
      if(dead)return;
      raf=requestAnimationFrame(frame);
      const dt=Math.min(clock.getDelta(),.05);

      if(headBone && previousBaseQuaternion){
        headBone.quaternion.copy(previousBaseQuaternion);
      }
      if(mixer)mixer.update(dt);

      const landingActive=isLandingVisible() && !reducedMotion;
      if(!landingActive){pointer.targetX=0;pointer.targetY=0;}
      const easing=1-Math.exp(-(landingActive?4.5:8)*dt);
      pointer.x+=(pointer.targetX-pointer.x)*easing;
      pointer.y+=(pointer.targetY-pointer.y)*easing;

      if(headBone){
        previousBaseQuaternion=headBone.quaternion.clone();
        headBone.rotation.order='YXZ';
        headBone.rotation.y+=pointer.x*.28;     // move mouse left -> look left
        headBone.rotation.x+=pointer.y*.16;
        headBone.rotation.z+=-pointer.x*.035;
      }
      if(pointerPivot){
        pointerPivot.rotation.y=pointer.x*.014;
        pointerPivot.rotation.x=-pointer.y*.008;
      }
      renderer.render(scene,camera);
    }
    frame();
    let ctx;
    decryptCharacter(controller.signal).then(gltf=>{
      if(dead)return;
      const character=gltf.scene;
      // Pointer motion uses this outer pivot; GSAP retains control of character.rotation.
      pointerPivot=new THREE.Group();scene.add(pointerPivot);pointerPivot.add(character);
      mixer=setupMixer(gltf);
      for(const name of ['footR','footL']){const obj=character.getObjectByName(name);if(obj)obj.position.y=3.36;}
      const neck=character.getObjectByName('spine005');headBone=neck;
      // Clear the rig baseline when the model is first attached.
      previousBaseQuaternion=null;
      let monitor=null,screenLight=null;
      character.children.forEach(obj=>{
        if(obj.name==='Plane004')obj.children.forEach(child=>{
          if(!child.isMesh)return;
          if(Array.isArray(child.material))child.material=child.material.map(m=>m.clone());else child.material=child.material.clone();
          const mats=Array.isArray(child.material)?child.material:[child.material];
          mats.forEach(mat=>{mat.transparent=true;mat.opacity=0;});
          if(mats.some(mat=>mat.name==='Material.027')){monitor=child;const mat=mats.find(m=>m.name==='Material.027');if(mat.color)mat.color.set('#FFFFFF');}
        });
        if(obj.name==='screenlight'&&obj.isMesh){screenLight=obj;obj.material=obj.material.clone();obj.material.transparent=true;obj.material.opacity=0;if(obj.material.emissive)obj.material.emissive.set('#C8BFFF');}
      });
      // Keep the reference's independent, scroll-scrubbed timelines.
      if (mobileView) return; // Mobile keeps its own stable framing; desktop retains reference scroll timeline.
      ctx=gsap.context(()=>{
        const landing=root.querySelector('.acref-landing');
        const about=root.querySelector('.acref-about');
        const what=root.querySelector('.acref-what');
        const landingText=root.querySelector('.acref-intro');
        const aboutText=root.querySelector('.acref-about-copy');
        const cards=root.querySelector('.acref-cards');
        // Text animation is mounted independently of the WebGL model below.
        // This preserves character motion timelines without competing on text opacity.
        const tl1=gsap.timeline({scrollTrigger:{trigger:landing,start:'top top',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
        tl1.to(character.rotation,{y:.7,duration:1},0)
          .to(camera.position,{z:22,duration:1},0)
          .fromTo(host,{xPercent:0},{xPercent:-25,duration:1},0)
          .to(landingText,{opacity:0,yPercent:40,duration:.8},0)
          .fromTo(aboutText,{yPercent:-20},{yPercent:0,duration:1},0);
        const tl2=gsap.timeline({scrollTrigger:{trigger:about,start:'center 55%',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
        tl2.to(camera.position,{z:75,y:8.4,duration:6,delay:2,ease:'power3.inOut'},0)
          .to(aboutText,{yPercent:30,duration:6},0)
          .to(aboutText,{opacity:0,delay:3,duration:2},0)
          .to(host,{xPercent:-12,delay:2,duration:5},0)
          .to(character.rotation,{y:.92,x:.12,delay:3,duration:3},0)
          .to(cards,{autoAlpha:1,delay:6,duration:.1},0);
        // Do not force the neck downward in What We Do.
        // The rig's typing animation controls the seated character's head.

        if(monitor){tl2.fromTo(monitor.position,{y:-10,z:2},{y:0,z:0,delay:1.5,duration:3},0);const mat=Array.isArray(monitor.material)?monitor.material.find(m=>m.name==='Material.027'):monitor.material;if(mat)tl2.to(mat,{opacity:1,duration:.8,delay:3.2},0);}
        if(screenLight)tl2.to(screenLight.material,{opacity:1,duration:.8,delay:4.5},0);
        const tl3=gsap.timeline({scrollTrigger:{trigger:what,start:'top top',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
        tl3.to(host,{yPercent:-100,duration:4,delay:1,ease:'none'},0)
          .to(character.rotation,{x:-.04,duration:2,delay:1},0);
        ScrollTrigger.refresh();
      },root);
    }).catch(err=>{if(!dead)setError(err.message||String(err));});
    return()=>{dead=true;controller.abort();window.removeEventListener('pointermove',onPointerMove);window.removeEventListener('blur',onPointerLeave);ctx?.revert();resizeObserver?.disconnect();cancelAnimationFrame(raf);renderer?.dispose();renderer?.domElement?.remove();scene.clear();};
  },[sectionRef]);
  return <div className="acref-character-container" aria-hidden="true"><div ref={hostRef} className="acref-character-model"/><div className="acref-model-failure" role="status">{error}</div></div>;
}
export default function AccutechCharacterHero({onWatchVideo}){
  const root=useRef(null);
  usePortfolioTextFX(root);
  return <div className="acref-root" ref={root}>
    <AccutechCursor rootRef={root}/>
    <ThreeCharacter sectionRef={root}/>
    <section className="acref-landing" id="home">
      <div className="acref-intro">
        <div className="acref-left">
          <span>WELCOME TO</span>
          <h1>Accutech ERP</h1>
          <p className="acref-hero-description">
            Accutech ERP is an all-in-one cloud-based business management solution.
            Simplify accounting, automate daily operations, and manage your business
            efficiently from one powerful platform.
          </p>
        </div>
        <div className="acref-right">
          <div className="acref-service-overview">
            <article className="acref-service-item">
              <h2>Smart Business <strong>Accounting</strong></h2>
              <p>Manage your business finances with advanced cloud accounting software.
                Simplify invoicing, track expenses, maintain financial records, and
                access real-time reports for smarter decision-making.</p>
            </article>
            <article className="acref-service-item">
              <h2>Inventory &amp; <strong>GST Management</strong></h2>
              <p>Streamline inventory tracking and GST billing with Accutech ERP.
                Monitor stock levels, manage sales and purchases, generate GST-compliant
                invoices, and simplify tax reporting from one platform.</p>
            </article>
          </div>
        </div>
      </div>
      <div className="acref-orb"/>
      <a href="#about" className="acref-scroll-hint">SCROLL TO EXPLORE ↓</a>
    </section>
    <section className="acref-about" id="about">
      <div className="acref-about-copy"><h3>ABOUT US</h3><p>Accutech ERP is a comprehensive cloud-based business management solution designed to streamline accounting, inventory, and GST operations. With intelligent automation and integrated financial tools, we empower businesses to enhance efficiency, improve accuracy, and make informed decisions for sustainable growth.</p></div>
    </section>
    <section className="acref-what" id="erp-services">
      <div className="acref-what-title"><h2>WHAT<br/><em>WE DO</em></h2></div>
      <div className="acref-cards">
        <article className="acref-card"><h3>ACCOUNTING &amp; GST</h3><h4>Cloud Financial Control</h4><p>Manage billing, ledgers, GST-ready invoices, financial statements and business accounts from one connected platform.</p><div className="acref-tags"><span>GST Billing</span><span>Accounting</span><span>Reports</span></div></article>
        <article className="acref-card"><h3>INVENTORY &amp; OPERATIONS</h3><h4>Complete Business Visibility</h4><p>Monitor stock movement, orders, locations and user permissions with useful, real-time information.</p><div className="acref-tags"><span>Inventory</span><span>Sales</span><span>Multi-User</span></div></article>
      </div>
      <div className="acref-bottom-actions">
        <a href="#EnquiryForm">Request Demo <span aria-hidden="true">↗</span></a>
        <button type="button" onClick={onWatchVideo}> <span aria-hidden="true">▷</span> Watch Video</button>
      </div>
    </section>
  </div>;
}
