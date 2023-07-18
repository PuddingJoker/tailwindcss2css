import Background from "./commonComponents/Background";
import floor8Pic from "./assets/images/zkt/floor8Pic.png"




const ZktHeader = () => {
    return <div className="min-w-[1180px] relative h-[728px]" style={{
        background: " linear-gradient(180deg, #F0F3FA 0%, #F8F9FC 107.49%)"
    }}>
        {/* <Background src={floor4}></Background> */}
        <div className="w-[1180px] mx-auto relative pt-[80px]">
            <div className="text-center tex-[#17181B] text-[26px] leading-[26px]">轻量化电商小程序体验，后台自定义快捷操作</div>
            <div className="mt-[16px] text-[14px] leading-[14px] text-[#5C5D5F] text-center">打造舒适的用户体验提高商品曝光度</div>
            <div className="mt-[48px] h-[444px] relative">
                <Background src={floor8Pic} />
            </div>
        </div>
    </div>;
};

export default ZktHeader
