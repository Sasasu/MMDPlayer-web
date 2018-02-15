import * as THREE from "three"
import * as Stats from "stats.js"
import "imports-loader?THREE=three!../node_modules/three/examples/js/loaders/TGALoader.js"
import "imports-loader?THREE=three!../node_modules/three/examples/js/loaders/MMDLoader.js"
import "imports-loader?THREE=three!../node_modules/three/examples/js/animation/MMDPhysics.js"
import "imports-loader?THREE=three!../node_modules/three/examples/js/animation/CCDIKSolver.js"

import { Object3D, MMDHelper, LoadingManager } from "three";


export default class MMDPlayer {
    public constructor() {


        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.y = 15;
        this.camera.position.z = 50;

        this._render = new THREE.WebGLRenderer({ antialias: true });
        this._render.setPixelRatio(window.devicePixelRatio);
        this._render.setSize(window.innerWidth, window.innerHeight);
        this._render.setClearColor(new THREE.Color(0x000000));
        this._render.shadowMap.enabled = true;

        this.scene = new THREE.Scene();

        this.spotLight = new THREE.SpotLight(0x223344);
        this.spotLight.position.set(5, 20, 15);
        this.spotLight.angle = 0.8;
        this.spotLight.intensity = 0.7;
        this.spotLight.penumbra = 0.8;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.bias = -0.001;

        var ambientLight = new THREE.AmbientLight(0xe0e0e0);
        this.scene.add(ambientLight);
        this.scene.add(this.spotLight);
        this.scene.add(this.spotLight.target);

        this.directionalLight = new THREE.DirectionalLight(0x333333);
        this.directionalLight.position.set(-15, 15, 20);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.x = 1024;
        this.directionalLight.shadow.mapSize.y = 1024;
        this.directionalLight.shadow.camera.right = 20;
        this.directionalLight.shadow.camera.top = 20;
        this.directionalLight.shadow.camera.left = -20;
        this.directionalLight.shadow.camera.bottom = -20;
        this._render.shadowMap.renderSingleSided = false;
        this._render.shadowMap.renderReverseSided = false;
        this.directionalLight.shadow.bias = -0.001;
        this.scene.add(this.directionalLight);

        this.mmdHelper = new THREE.MMDHelper();
    }
    public load(): LoadingManager {
        var manager = new THREE.LoadingManager();
        var loader = new THREE.MMDLoader(manager);
        loader.load(this.modeFile, [this.vmdFile], function (mesh) {
            var mikuModel = mesh;
            var materials = <any>mesh.material;
            for (var i = 0, il = materials.length; i < il; i++) {
                var material = materials[i];
                material.emissive.multiplyScalar(0.2);
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.mmdHelper.add(mesh);
            this.mmdHelper.setAnimation(mesh);
            this.mmdHelper.setPhysics(mesh);
            this.toAdd.push(mesh);
        }.bind(this));
        loader.loadVmds([this.cameraFile], function (vmd) {
            this.mmdHelper.setCamera(this.camera);
            loader.pourVmdIntoCamera(this.camera, vmd);
            this.mmdHelper.setCameraAnimation(this.camera);
        }.bind(this));
        loader.loadAudio(this.musicFile, function (audio, listener) {
            listener.position.z = 1;
            this.mmdHelper.setAudio(audio, listener, { delayTime: 0.0 });
            this.toAdd.push(audio);
            this.toAdd.push(listener);
        }.bind(this));
        loader.loadModel(this.stageFile, function (mesh) {
            var sceneModel = mesh;
            var materials = <any>mesh.material;
            for (var i = 0, il = materials.length; i < il; i++) {
                var material = materials[i];
                material.emissive.multiplyScalar(0.2);
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.mmdHelper.add(mesh);
            this.toAdd.push(mesh);
        }.bind(this));
        return manager;
    }
    private toAdd: Array<THREE.Mesh> = new Array();
    public init(): void {
        this.toAdd.forEach(function (item) {
            this.scene.add(item);
        }.bind(this));
        this.mmdHelper.unifyAnimationDuration({ afterglow: 1.0 });
        this.addToBrowser();
        this._render.render(this.scene, this.camera);
    }
    public play() {
        this.clock = new THREE.Clock();
        this._render.domElement.style.display = "block";
        MMDPlayer.animate(this);
    }
    public resize(width, height) {
        this._render.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateMatrix();
    }

    private static animate(object: MMDPlayer) {
        object.render();
        var stats = new Stats();
        stats.showPanel(1);
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function lambda() {
            stats.begin();
            object.render();
            stats.end();
            requestAnimationFrame(lambda);
        })
    }

    private addToBrowser(): void {
        this._render.domElement.style.display = "none";
        document.querySelector("#main-div").appendChild(this._render.domElement);
    }

    private render(): void {
        var delta = this.clock.getDelta();
        this.mmdHelper.animate(delta);
        this._render.render(this.scene, this.camera);
    }
    public vmdFile: string = null;
    public stageFile: string = null;
    public mmdHelper: MMDHelper = null;
    public modeFile: string = null;
    public cameraFile: string = null;
    public musicFile: string = null;
    public clock: THREE.Clock = null;
    public container: HTMLElement = null;
    public camera: THREE.PerspectiveCamera = null;
    public _render: THREE.WebGLRenderer = null;
    public scene: THREE.Scene = null;
    public spotLight: THREE.SpotLight = null;
    public directionalLight: THREE.DirectionalLight = null;
}