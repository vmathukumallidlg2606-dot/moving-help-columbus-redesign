(()=>{
 const section=document.querySelector('#moving-story');if(!section)return;
 const scene=section.querySelector('.move-scene'),truck=section.querySelector('.truck-group'),open=section.querySelector('.truck-open'),closed=section.querySelector('.truck-closed');
 const cargo=[...section.querySelectorAll('.cargo')],slider=document.querySelector('#move-progress'),play=document.querySelector('#move-play'),replay=document.querySelector('#move-replay');
 const step=document.querySelector('#move-step'),caption=document.querySelector('#move-caption'),phase=document.querySelector('#move-phase'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>n*n*(3-2*n);let progress=0,playing=false,manual=false,frame=0,startTime=0,startProgress=0,scrollQueued=false;
 function paint(p){progress=clamp(p);const narrow=scene.clientWidth<600;const starts=narrow?[[2,52],[2,32],[29,29],[20,70]]:[[4,55],[8,29],[29,26],[28,65]];const target=narrow?[48,59]:[56,55];
  cargo.forEach((el,i)=>{const q=ease(clamp((progress-(.1+i*.115))/.24));const [x,y]=starts[i];const arc=Math.sin(q*Math.PI)*(narrow?13:17);el.style.left=(x+(target[0]-x)*q)+'%';el.style.top=(y+(target[1]-y)*q-arc)+'%';el.style.transform=`translate(-12%,-35%) scale(${1-q*.84}) rotate(${(i%2?1:-1)*Math.sin(q*Math.PI)*12}deg)`;el.style.opacity=1-clamp((q-.78)/.22);el.style.zIndex=q>.8?'2':'4';});
  const shut=ease(clamp((progress-.72)/.12));closed.style.opacity=shut;open.style.opacity=1-shut;
  const departure=ease(clamp((progress-.85)/.15));truck.style.transform=`translateX(${departure*160}%)`;
  const state=progress<.12?0:progress<.72?1:progress<.85?2:3;
  const titles=['01 / A FRESH START','02 / EVERY PIECE, PACKED','03 / READY FOR THE ROAD','04 / ON TO WHAT’S NEXT'];const texts=['The things that make it home.','A place for every part of your life.','Packed up. Doors closed. Let’s go.','Your next chapter is on its way.'];const labels=['Ready to load','Loading the truck','Closing the doors','Heading out'];
  step.textContent=titles[state];caption.textContent=texts[state];phase.textContent=labels[state];slider.value=Math.round(progress*100);slider.setAttribute('aria-valuetext',`${Math.round(progress*100)} percent — ${labels[state]}`);
 }
 function stop(){playing=false;cancelAnimationFrame(frame);play.textContent=progress>=1?'Play again ▶':'Play sequence ▶';play.setAttribute('aria-label','Play moving animation');}
 function tick(now){if(!playing)return;paint(startProgress+(now-startTime)/11000);if(progress>=1){stop();return}frame=requestAnimationFrame(tick)}
 function begin(){if(motion.matches){paint(0);return}manual=true;if(progress>=.99)paint(0);startProgress=progress;startTime=performance.now();playing=true;play.textContent='Pause ❚❚';play.setAttribute('aria-label','Pause moving animation');frame=requestAnimationFrame(tick)}
 play.addEventListener('click',()=>playing?stop():begin());replay.addEventListener('click',()=>{stop();paint(0);manual=true;if(!motion.matches)begin()});slider.addEventListener('input',()=>{stop();manual=true;paint(Number(slider.value)/100)});
 function scroll(){scrollQueued=false;if(motion.matches||manual||playing)return;const r=section.getBoundingClientRect();const distance=section.offsetHeight-innerHeight;paint((24-r.top)/Math.max(1,distance));}
 window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(scroll)}},{passive:true});window.addEventListener('resize',()=>paint(progress));
 motion.addEventListener('change',()=>{stop();manual=false;paint(0);if(!motion.matches)scroll()});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 paint(0);scroll();
})();
