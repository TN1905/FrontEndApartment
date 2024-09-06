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
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
} from "recharts";
import { sumTotalPriceRented } from "../../api/walletTransaction/sumTotalPriceRented";
import { sumTotalPriceCommission } from "../../api/walletTransaction/sumTotalPriceCommission";
import { totalCountUsersRented } from "../../api/walletTransaction/getCountUsersRented";
import { getPriceRentedByMonth } from "../../api/walletTransaction/getPriceRentedByMonth";
import {getPriceDepositeByMonth} from "../../api/walletTransaction/getPriceDepositeByMonth";
import {getPriceCommissionByMonth} from "../../api/walletTransaction/getPriceCommissionByMonth";
import {getPriceWithdrawByMonth} from "../../api/walletTransaction/getPriceWithdrawByMonth";
const Analystic = () => {
  const { user, setUser, wallet, setWallet } = useContext(HouseContext);
  const [sumPriceRented, setSumPriceRented] = useState(0);
  const [sumPriceCommission, setSumPriceCommission] = useState(0);
  const [totalUsersRented, setTotalUsersRented] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [depositeData, setDepositeData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const months = ["February", "March", "April", "May", "June", "July"];
  useEffect(() => {
    const initiate = async () => {
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

      const depositeData = await Promise.all(
        months.map(async (month) => {
          const priceDeposite = await getPriceDepositeByMonth(month);
          return {
            month: new Date(2024, month - 1).toLocaleString("en-US", {
              month: "long",
            }),
            priceDeposite,
          };
        })
      );
      const commissionData = await Promise.all(
        months.map(async (month) => {
          const priceCommission = await getPriceCommissionByMonth(month);
          return {
            month: new Date(2024, month - 1).toLocaleString("en-US", {
              month: "long",
            }),
            priceCommission,
          };
        })
      );

      const withdrawData = await Promise.all(
        months.map(async (month) => {
          const priceWithdraw = await getPriceWithdrawByMonth(month);
          return {
            month: new Date(2024, month - 1).toLocaleString("en-US", {
              month: "long",
            }),
            priceWithdraw,
          };
        })
      );

      const pieData = [
        {
          type: "rented",
          value: revenueData.reduce((acc, curr) => acc + curr.priceRented, 0),
          fill: "#009688",
        },
        {
          type: "deposite",
          value: depositeData.reduce(
            (acc, curr) => acc + curr.priceDeposite,
            0
          ),
          fill: "#ff5722",
        },
        {
          type: "commission",
          value: commissionData.reduce(
            (acc, curr) => acc + curr.priceCommission,
            0
          ),
          fill: "#ffc107",
        },
        {
          type: "withdraw",
          value: withdrawData.reduce(
            (acc, curr) => acc + curr.priceWithdraw,
            0
          ),
          fill: "#ff9800",
        },
      ];

      setRevenueData(revenueData);
      setDepositeData(depositeData);
      setPieData(pieData); // Thêm dòng này
    };
    initiate();
  }, []);
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Total Price Rented by Month</CardTitle>
            <CardDescription>
              A column chart showing monthly revenue rented for the past 6
              months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinechartChart data={revenueData} className="aspect-[4/3]" />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Up 12% this month <TrendingUpIcon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Febuarry - Jyky 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Price Deposite By Month</CardTitle>
            <CardDescription>
              A bar chart showing daily profit for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarchartChart data={depositeData} className="aspect-[4/3]" />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Down 5% this week <TrendingDownIcon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Febuarry - July, 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Percents of type payment</CardTitle>
            <CardDescription>
              A pie chart showing the type of transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PiechartcustomChart data={pieData} className="aspect-square" />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Accessories 25% <ArrowUpIcon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  June 01 - June 30, 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Analystic;

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function BarchartChart({ data, ...props }) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          deposite: {
            label: "Deposite",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[300px] w-[350px]"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="priceDeposite" fill="#009688" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function CalendarClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  );
}

function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function PiechartcustomChart({ data, ...props }) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          rented: {
            label: "Rented",
            color: "#009688",
          },
          deposite: {
            label: "Deposite",
            color: "#ff5722",
          },
          commission: {
            label: "Commission",
            color: "#ffc107",
          },
          withdraw: {
            label: "Withdraw",
            color: "#ff9800",
          },
        }}
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="type"
            fill={(entry) => {
              const config = {
                rented: "#009688",
                deposite: "#ff5722",
                commission: "#ffc107",
                withdraw: "#ff9800",
              };
              return config[entry.type];
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}

function TrendingDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

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
