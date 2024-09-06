import React, { useState, useLocation, useEffect, useContext } from "react";
import { HouseContext } from "../Apartment/HouseContext";
import { getWallet } from "../../api/wallet/getWallet";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {sumTotalPriceRented} from "../../api/walletTransaction/sumTotalPriceRented";
import { sumTotalPriceCommission } from "../../api/walletTransaction/sumTotalPriceCommission";
import { totalCountUsersRented } from "../../api/walletTransaction/getCountUsersRented";
import {getPriceRentedByMonth} from "../../api/walletTransaction/getPriceRentedByMonth";
const AdminDashboard = () => {
  const { user, setUser, wallet, setWallet } = useContext(HouseContext);
  const [sumPriceRented,setSumPriceRented] = useState(0);
  const [sumPriceCommission,setSumPriceCommission] = useState(0);
  const [totalUsersRented,setTotalUsersRented] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const months = ["February", "March", "April", "May", "June", "July"];
  useEffect(() => {
    const initiate = async () => {
      
      const sumRentedData = await sumTotalPriceRented();
      const sumCommissionData = await sumTotalPriceCommission();
      const totalUsersData = await totalCountUsersRented();
      if(sumRentedData && sumCommissionData && totalUsersData){
        console.log(sumRentedData);
        setSumPriceCommission(sumCommissionData);
        setSumPriceRented(sumRentedData);
        setTotalUsersRented(totalUsersData);
      }
      console.log("???");
      const currentMonth = new Date().getMonth() + 1; // tháng hiện tại (1-12)
      const months = Array.from(
        { length: 6 },
        (_, i) => currentMonth - i
      ).reverse();
      const revenueData = await Promise.all(
        months.map(async (month) => {
          const priceRented = await getPriceRentedByMonth(month);
          return {
            month: new Date(2024, month - 1).toLocaleString("en-US", {
              month: "long",
            }),
            priceRented,
          };
        })
      );
      setRevenueData(revenueData);
    }
    initiate();
  },[])
  
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Price Rented</CardTitle>
            <CardDescription>The total amount of price rented</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {sumPriceRented.toLocaleString("vi-VN")} VNĐ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue By Commisstion</CardTitle>
            <CardDescription>The total amount of commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {sumPriceCommission.toLocaleString("vi-VN")} VNĐ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total users rented</CardTitle>
            <CardDescription>The number of new users rented.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalUsersRented} Users</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              A chart showing revenue over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinechartChart
              data={revenueData}
              className="w-full aspect-[3/2]"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboard;

// function LinechartChart(props) {
//   return (
//     <div {...props}>
//       <ChartContainer
//         config={{
//           desktop: {
//             label: "Desktop",
//             color: "black",
//           },
//         }}
//       >
//         <LineChart
//           accessibilityLayer
//           data={[
//             { month: "January", desktop: 186 },
//             { month: "February", desktop: 305 },
//             { month: "March", desktop: 237 },
//             { month: "April", desktop: 73 },
//             { month: "May", desktop: 209 },
//             { month: "June", desktop: 214 },
//           ]}
//           margin={{
//             left: 12,
//             right: 12,
//           }}
//         >
//           <CartesianGrid vertical={false} />
//           <XAxis
//             dataKey="month"
//             tickLine={false}
//             axisLine={false}
//             tickMargin={8}
//             tickFormatter={(value) => value.slice(0, 3)}
//           />
//           <ChartTooltip
//             cursor={false}
//             content={<ChartTooltipContent hideLabel />}
//           />
//           <Line
//             dataKey="desktop"
//             type="natural"
//             stroke="var(--color-desktop)"
//             strokeWidth={2}
//             dot={false}
//           />
//         </LineChart>
//       </ChartContainer>
//     </div>
//   );
// }

function LinechartChart({ data, ...props }) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "black",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="priceRented"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}


