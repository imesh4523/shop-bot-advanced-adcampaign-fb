import { u as useQuery } from "./index-DMluhAEX.js";
import { a as api } from "./routes-DLr0d2Nv.js";
function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return api.orders.list.responses[200].parse(data);
    }
  });
}
export {
  useOrders as u
};
