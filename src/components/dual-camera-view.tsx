'use client';
import { CameraView } from './camera-view';

export function DualCameraView() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col justify-between items-end gap-4 z-10">
      <CameraView title="Road View" facingMode="environment" />
      <CameraView title="Cabin View" facingMode="user" />
    </div>
  );
}
