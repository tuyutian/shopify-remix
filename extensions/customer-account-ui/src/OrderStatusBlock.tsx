import {
	BlockStack,
	Button,
	Card,
	Text,
	reactExtension,
	useOrder,
	useShop,
} from "@shopify/ui-extensions-react/customer-account"
import { useEffect, useState } from "react"

export default reactExtension("customer-account.order-status.block.render", () => <OrderStatusExtension />)

function OrderStatusExtension() {
	const order = useOrder()
	const shop = useShop()
	const [orderData, setOrderData] = useState<{
		button_text: string
		description: string
		title: string
		track_link: string
	} | null>(null)

	useEffect(() => {
		let isSubscribed = true
		async function queryApi() {
			try {
				const apiResponse = await fetchOrderStatus(shop.myshopifyDomain, order.name).then((res) => res.json())

				if (isSubscribed) {
					// 只在组件仍然挂载时更新状态
					if (apiResponse.code === 200) {
						setOrderData(apiResponse.data)
					} else {
						setOrderData(null)
					}
				}
			} catch (error) {
				console.error("API error:", error)
				if (isSubscribed) {
					setOrderData(null)
				}
			}
		}

		// 只在两个值都存在时才调用 API
		if (order?.name && shop?.myshopifyDomain) {
			queryApi()
		}

		// 清理函数
		return () => {
			isSubscribed = false
		}
	}, [])

	function fetchOrderStatus(shop: string, name: string) {
		const encodedShop = encodeURIComponent(shop)
		const encodedName = encodeURIComponent(name)
		const url = `https://tms.trackingmore.net/api/v2/checkout/order_status_widget?shop=${encodedShop}&order_name=${encodedName}`
		const result = fetch(url)
		return result
	}

	if (!orderData) {
		return null
	}
	return (
		<Card padding={false}>
			<BlockStack cornerRadius="base" padding="base" inlineAlignment="start" spacing="tight">
				<Text size="medium" emphasis="bold">
					{orderData?.title ?? "Shipped"}
				</Text>
				<Text appearance="subdued">
					{orderData?.description ?? "Your order is shipped. Track your order to find more details."}
				</Text>
				<Button kind="primary" to={orderData?.track_link}>
					{orderData?.button_text ?? "Track your order"}
				</Button>
			</BlockStack>
		</Card>
	)
}
