import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  LineSegments,
  Vector3,
} from 'three';

type CubeProps = {
  colour: Color;
  position: Vector3;
};

export function Cube(props: CubeProps) {
  const geometry = new BoxGeometry(0.5, 0.5, 0.5);
  const edgesGeometry = new EdgesGeometry(geometry);
  const lineSegments = new LineSegments(edgesGeometry);
  lineSegments.computeLineDistances();

  return (
    <group>
      <mesh position={props.position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={props.colour} />
        <primitive object={lineSegments} position={[0.001, 0.001, 0.001]}>
          <lineBasicMaterial color={'black'} linewidth={1} />
        </primitive>
      </mesh>
    </group>
  );
}
