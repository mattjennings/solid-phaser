import { Assets } from 'phelte';
export declare type SvelteComponent<T = {}> = T & {
    default: any;
};
export declare type SceneComponent = SvelteComponent<{
    preload?: (scene: Phaser.Scene) => any;
    create?: (scene: Phaser.Scene) => any;
    init?: (scene: Phaser.Scene) => any;
    assets?: Assets;
    physics?: Phaser.Types.Core.PhysicsConfig;
    plugins?: any[];
}>;
export declare type ComponentLoader = () => Promise<SvelteComponent>;
export declare type SceneComponentLoader = () => Promise<SceneComponent>;
export interface SceneComponentData {
    path: string;
    component: string;
    initial: boolean;
    $loading: string | null;
}
export interface TemplateComponentData {
    path: string;
    component: string;
}
export declare type ManifestData = {
    game: {
        component: string;
    };
    scenes: Record<string, SceneComponentData>;
    templates: Record<string, TemplateComponentData>;
};
export interface Manifest {
    game: {
        component: any;
    };
    scenes: Record<string, Scene>;
    templates: Record<string, Template>;
}
export interface Scene {
    path: string;
    component: SceneComponentLoader;
    $loading: string;
    initial: boolean;
}
export interface Template {
    path: string;
    component: SceneComponentLoader;
    $loading: ComponentLoader;
    initial: boolean;
}
