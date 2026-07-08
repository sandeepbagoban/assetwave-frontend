// Shimmering placeholder block — pages compose their own skeleton shapes
// from this primitive to mirror the real content's dimensions.
export default function Skeleton({ width = '100%', height = 14, radius = 6, style }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}
