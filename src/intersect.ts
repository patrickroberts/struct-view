type Contravariant<T> = (x: T) => void;

// transforms { a: b; } | { c: d; } into { a: b; c: d; }
export type Intersect<Union> =
  (Union extends any ? Contravariant<Union> : never) extends Contravariant<infer Intersection>
    ? { [P in keyof Intersection]: Intersection[P]; }
    : never;
