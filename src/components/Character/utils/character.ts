import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        // Prefer an unpacked GLB if it exists so the face can be swapped easily.
        const loadClearModel = async () => {
          try {
            const res = await fetch("/models/character-decoded.glb?v=1", {
              cache: "no-store",
            });
            if (!res.ok) return null;
            const buf = await res.arrayBuffer();
            return URL.createObjectURL(new Blob([buf]));
          } catch {
            return null;
          }
        };

        const clearModelUrl = await loadClearModel();
        const encryptedBlob =
          clearModelUrl === null
            ? await decryptFile("/models/character.enc?v=2", "MyCharacter12")
            : null;
        const blobUrl =
          clearModelUrl ?? URL.createObjectURL(new Blob([encryptedBlob!]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                const meshName = mesh.name || "";
                const baseMat = mesh.material as THREE.MeshStandardMaterial;

                // Change clothing colors to match site theme
                if (mesh.material) {
                  if (meshName === "BODY.SHIRT") {
                    const newMat = baseMat.clone();
                    newMat.color = new THREE.Color("#0c1828"); // deep charcoal
                    newMat.roughness = 0.62;
                    newMat.metalness = 0.05;
                    mesh.material = newMat;
                  } else if (meshName === "Pant") {
                    const newMat = baseMat.clone();
                    newMat.color = new THREE.Color("#0b0f18"); // near-black
                    newMat.roughness = 0.78;
                    mesh.material = newMat;
                  } else if (meshName === "Cap.001" || meshName === "CAP.001") {
                    const newMat = baseMat.clone();
                    newMat.color = new THREE.Color("#d8d8e3");
                    newMat.emissive = new THREE.Color("#ffffff");
                    newMat.emissiveIntensity = 0.08;
                    mesh.material = newMat;
                  } else if (meshName === "Cap.002" || meshName === "CAP.002") {
                    const newMat = baseMat.clone();
                    newMat.color = new THREE.Color("#2be1c5"); // accent brim
                    newMat.roughness = 0.35;
                    mesh.material = newMat;
                  } else if (meshName === "Eyebrow") {
                    // Softer eyebrow color to reduce the angry look
                    const newMat = baseMat.clone();
                    newMat.color = new THREE.Color("#caa186");
                    mesh.material = newMat;
                  } else if (meshName === "Teeth.001") {
                    // Hide the gritted teeth to calm the expression
                    mesh.visible = false;
                  } else if (
                    meshName === "Face.002" ||
                    meshName === "Hand" ||
                    meshName === "Ear.001" ||
                    meshName === "Neck"
                  ) {
                    // Warm up skin tones and soften specular for a friendlier look
                    const newMat = baseMat.clone();
                    newMat.color = baseMat.color.clone().lerp(
                      new THREE.Color("#f1c7a4"),
                      0.32
                    );
                    newMat.roughness = 0.55;
                    newMat.metalness = 0.02;
                    mesh.material = newMat;
                  }
                }

                // Reset facial morphs so the neutral pose isn't angry
                if (meshName === "Face.002" && mesh.morphTargetInfluences) {
                  mesh.morphTargetInfluences = mesh.morphTargetInfluences.map(
                    (_v, i) => (i === 2 ? 0.1 : 0)
                  );
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }

              // Lift brows slightly so the face looks friendlier
              if (child.name === "eyebrow_L" || child.name === "eyebrow_R") {
                child.position.y += 0.04;
                child.rotation.z = THREE.MathUtils.degToRad(6);
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
