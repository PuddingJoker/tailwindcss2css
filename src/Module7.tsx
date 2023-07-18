import Background from "./commonComponents/Background";
import floor4 from "./assets/images/zkt/floor4.png"
import floor7Pic from "./assets/images/zkt/floor7Pic.png"




const ZktHeader = () => {
    return <div className={`min-w-[1180px] relative h-[726px]`}>
        {/* <Background src={floor4}></Background> */}
        <div className="w-[1180px] mx-auto relative pt-[80px]">
            <div className="text-center tex-[#17181B] text-[26px] leading-[26px]">私域阵地经营</div>
            <div className="mt-[16px] text-[14px] leading-[14px] text-[#5C5D5F] text-center">多场景触达，实现更高的用户转化和复购</div>
            <div className="mt-[48px] h-[442px] relative">
                <Background src={floor7Pic} />
            </div>
        </div>
    </div>;
};

export default ZktHeader
