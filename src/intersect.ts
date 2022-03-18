type Contravariant<T> = (x: T) => void;

export type Intersect<Union> =
  (Union extends any ? Contravariant<Union> : never) extends Contravariant<infer Intersection>
    ? { [P in keyof Intersection]: Intersection[P]; }
    : never;
