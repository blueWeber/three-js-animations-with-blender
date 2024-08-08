import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { scene, camera, renderer } from '/_3d-env/ThreeDefaultBase.js';

camera.position.set(0, 1, 4);

// light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

// loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('three/addons/libs/draco/');
loader.setDRACOLoader(dracoLoader);

//
let model, skeleton, mixer, clip, char, action, animations, clock;

loader.load('./mixamo-anim.glb', function (gltf) {
  console.log(gltf);
  const { scene: s, animations: anims } = gltf;
  model = s;
  animations = anims;
  char = model.children[0];
  scene.add(model);

  skeleton = new THREE.SkeletonHelper(model);
  skeleton.visible = true;
  scene.add(skeleton);

  // 모델과 애니메이션 섞어줌
  mixer = new THREE.AnimationMixer(model);
  // 애니메이션 내용
  clip = animations[2];
  // 애니메이션 재생기
  action = mixer.clipAction(clip);
  action.play();

  //
  clock = new THREE.Clock();

  renderer.setAnimationLoop(animate);
});

function animate() {
  const mixerUpdateDelta = clock.getDelta();
  mixer.update(mixerUpdateDelta);
}

//
//
const btns = document.querySelectorAll('.btn');
btns.forEach((btn) => {
  const { id } = btn;
  switch (id) {
    case 'btn-t':
      btn.addEventListener('click', onClickT);
      break;
    case 'btn-jump':
      btn.addEventListener('click', onClickJump);
      break;
    case 'btn-walk':
      btn.addEventListener('click', onClickWalk);
      break;
  }
});
function onClickT() {
  mixer.stopAllAction();
  clip = animations[0];
  action = mixer.clipAction(clip);
  action.stop().reset().play();
}
function onClickJump() {
  mixer.stopAllAction();
  clip = animations[1];
  action = mixer.clipAction(clip);
  action.stop().reset().play();
}
function onClickWalk() {
  mixer.stopAllAction();
  clip = animations[2];
  action = mixer.clipAction(clip);
  action.stop().reset().play();
}
