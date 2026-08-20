export type EngineerNode = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
};

export type EngineerRoute = {
  id: string;
  name: string;
  node_ids: string[];
  published: boolean;
};

export const nodeColors: Record<string, string> = {
  Temple: "#d9514e",
  "Heritage Site": "#c9973e",
  "Entry Gate": "#2e9f5b",
  "Exit Gate": "#3478c9",
  "Queue Point": "#dfa21d",
  "Craft Hub": "#0c716f",
  Emergency: "#8b3fd1",
  Parking: "#687980",
};
