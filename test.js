
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement;
const menu=document.querySelector('.menu');
const nav=document.querySelector('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.hidden=!open;});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.focus();}});

if('IntersectionObserver' in window&&!reduced.matches){
  document.documentElement.classList.add('motion');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
}

const stage=document.querySelector('#stage');
if(stage){
  stage.addEventListener('pointermove',e=>{
    if(reduced.matches||e.pointerType!=='mouse')return;
    const r=stage.getBoundingClientRect();
    root.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));
    root.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));
  });
  stage.addEventListener('pointerleave',()=>{root.style.setProperty('--mx','0');root.style.setProperty('--my','0');});
}

const hero=document.querySelector('#hero');
const film=document.querySelector('#film');
const explodeLabel=document.querySelector('#explode-label');
let queued=false;
function clamp(n){return Math.max(0,Math.min(1,n))}
function tickScroll(){
  queued=false;
  if(hero){
    const r=hero.getBoundingClientRect();
    const dist=hero.offsetHeight-innerHeight;
    const p=reduced.matches?1:clamp((-r.top)/Math.max(1,dist));
    root.style.setProperty('--p',p.toFixed(4));
  }
  
}
function onScroll(){if(!queued){queued=true;requestAnimationFrame(tickScroll)}}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',tickScroll);
tickScroll();

const form=document.querySelector('#quote-form'),preview=document.querySelector('#message-preview'),status=document.querySelector('#form-status');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const date=document.querySelector('#date').value;
  const message=`Hi Bruce, I'd like a quote for ${document.querySelector('#service').value.toLowerCase()}. Move size: ${document.querySelector('#size').value}.${date?' Preferred date: '+date+'.':''}${document.querySelector('#details').value.trim()?' Details: '+document.querySelector('#details').value.trim():''} Could you confirm availability and pricing?`;
  preview.value=message;
  document.querySelector('#sms-link').href='sms:+16147173969?body='+encodeURIComponent(message);
  document.querySelector('#message-result').hidden=false;
  status.textContent='Message prepared, not sent. Open your messaging app or copy it below.';
  preview.focus();
});
document.querySelector('#copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(preview.value);status.textContent='Message copied. Nothing has been sent.'}
  catch{preview.focus();preview.select();status.textContent='Select and copy the message, then paste it into your messaging app.'}
});

(()=>{
 const section=document.querySelector('#moving-story');if(!section)return;
 const scene=section.querySelector('.move-scene'),truck=section.querySelector('.truck-group'),open=section.querySelector('.truck-open'),closed=section.querySelector('.truck-closed');
 const cargo=[...section.querySelectorAll('.cargo')],slider=document.querySelector('#move-progress'),play=document.querySelector('#move-play'),replay=document.querySelector('#move-replay');
 const step=document.querySelector('#move-step'),caption=document.querySelector('#move-caption'),phase=document.querySelector('#move-phase'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const ease=n=>n*n*(3-2*n);let progress=0,playing=false,manual=false,frame=0,startTime=0,startProgress=0,scrollQueued=false;
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

reduced.addEventListener('change',()=>{if(reduced.matches)document.documentElement.classList.remove('motion');tickScroll();});
// 3D Particles & Cubes
const setup3DExtras = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const stage = document.querySelector('.stage');
  if (stage) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    stage.appendChild(particlesContainer);
    for (let i = 0; i < 40; i++) {
      let p = document.createElement('div');
      p.className = 'particle';
      let size = Math.random() * 12 + 6;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--x1', (Math.random() * 120 - 10) + 'vw');
      p.style.setProperty('--y1', (Math.random() * 40 + 60) + 'vh');
      p.style.setProperty('--z1', (Math.random() * 500 - 250) + 'px');
      p.style.setProperty('--x2', (Math.random() * 120 - 10) + 'vw');
      p.style.setProperty('--y2', (Math.random() * -20 - 20) + 'vh');
      p.style.setProperty('--z2', (Math.random() * 500 - 250) + 'px');
      p.style.setProperty('--dur', (Math.random() * 15 + 15) + 's');
      p.style.animationDelay = (Math.random() * -30) + 's';
      particlesContainer.appendChild(p);
    }
  }

  const world = document.querySelector('.world');
  if (world) {
    const cubeContainer = document.createElement('div');
    cubeContainer.className = 'cube-container';
    for(let i=0; i<4; i++) {
      let cube = document.createElement('div');
      cube.className = 'hero-cube';
      cube.innerHTML = '<div class="face front"></div><div class="face back"></div><div class="face right"></div><div class="face left"></div><div class="face top"></div><div class="face bottom"></div>';
      cube.style.setProperty('--sx', (Math.random() * 800 - 400) + 'px');
      cube.style.setProperty('--sy', (Math.random() * 400 - 100) + 'px');
      cube.style.setProperty('--sz', (Math.random() * 400 - 100) + 'px');
      cube.style.setProperty('--ex', (Math.random() * 800 - 400) + 'px');
      cube.style.setProperty('--ey', (Math.random() * -600 - 300) + 'px');
      cube.style.setProperty('--ez', (Math.random() * 400 - 100) + 'px');
      cube.style.animationDelay = (Math.random() * -40) + 's';
      cube.style.animationDuration = (Math.random() * 25 + 20) + 's';
      cubeContainer.appendChild(cube);
    }
    world.appendChild(cubeContainer);
  }
};

// 3D Tilt Cards
const setupTiltCards = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const tiltElements = document.querySelectorAll('.service, .pricing-tier, .review');
  tiltElements.forEach(el => {
    el.classList.add('tilt-card');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;
      el.style.transform = perspective(1000px) scale3d(1.03, 1.03, 1.03) rotateX( + rotateX + deg) rotateY( + rotateY + deg);
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)';
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setup3DExtras();
  setupTiltCards();
});
  let hasExploded = false;
  if(film) {
    const filmObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasExploded && !reduced.matches) {
          hasExploded = true;
          let start = null;
          function animateExplode(timestamp) {
            if (!start) start = timestamp;
            let progress = (timestamp - start) / 1800; // 1.8s
            if (progress > 1) progress = 1;
            let ease = 1 - Math.pow(1 - progress, 3);
            root.style.setProperty('--explode', ease.toFixed(4));
            if (progress < 1) {
              requestAnimationFrame(animateExplode);
            } else {
              setTimeout(() => {
                const nextSec = document.querySelector('#services');
                if(nextSec) {
                  const y = nextSec.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({top: y, behavior: 'smooth'});
                }
              }, 800);
            }
          }
          requestAnimationFrame(animateExplode);
        } else if (entry.isIntersecting && reduced.matches) {
           root.style.setProperty('--explode', 1);
        }
      });
    }, { threshold: 0.1 });
    filmObserver.observe(film);
  }
