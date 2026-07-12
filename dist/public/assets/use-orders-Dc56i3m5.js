import { u as useQuery } from "./index-Dj-ZIOZL.js";
import { a as api } from "./routes-CuIIW9wP.js";
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
