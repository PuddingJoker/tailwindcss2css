import Background from "./commonComponents/Background";
import floor2 from "./assets/images/zkt/floor2.png"

const lists = [
    {
        title: "快速开店",
        desc: `一键开店，后台自定义操作时效<br/>快`
    },
    {
        title: "玩法多样",
        desc: `优惠券用法多样，满足不同营销<br/>需求
`
    },
    {
        title: "平台流量",
        desc: `客户聚合形成流量互通，免费流<br/>量取用`
    },
    {
        title: "系统稳定",
        desc: `平台系统稳定高效，后台操作顺<br/>畅`
    },
    {
        title: "商户号进件",
        desc: `后台支持微信支付商号进件，极<br/>速开通`
    },
    {
        title: "快速提款",
        desc: `商品货款提取周期短，现金流回<br/>款率高`
    },
    {
        title: "客服支持",
        desc: `24小时客服团队支持产品售后`
    },
    {
        title: "多平台数据对接",
        desc: `支持多电商平台内数据流转回传`
    },
]



const ZktHeader = () => {
    return <div className="min-w-[1180px] relative h-[830px]">
        <div className="w-[1180px] mx-auto relative pt-[80px]">
            <div className="text-center tex-[#17181B] text-[26px] leading-[26px] mb-[48px]">值客推电商平台类小程序优势</div>
            <div className="flex justify-between flex-wrap">
                {
                    lists.map((item, index) => (
                        <div className="w-[280px] h-[276px] border-[1px] border-[#efefef] pt-[50px] mb-[20px] bg-[#fff] overflow-hidden rounded-[4px] shadow-boxS">
                            <div className="mx-auto w-[80px] h-[80px] relative mb-[26px]">
                                <Background src={require(`./assets/images/zkt/xcx${index}.png`)} />
                            </div>
                            <div className="mb-[16px] text-[20px] leading-[20px] text-center text-[#17181b]">{item.title}</div>
                            <div className="text-[14px] leading-[24px] text-center text-[#808082]" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div >;
};

export default ZktHeader
