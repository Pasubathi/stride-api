
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { GET_DOCUMENT_BY_ID , SALES_FORCE } from "./api";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getProductsByID(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getProductsByID();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getProductsByID() {
        const { sfid, user_id } = req.body;
        if (sfid == "" || sfid == undefined)
        return res.status(200).send({ status:"error", message: "Product is mandatory" })
        try {
            const id = String(sfid);
            const productDate = await prisma.product2.findFirst({
                select:{
                    product_category__c: true,
                    product_sub_category__c: true,
                    product_category_lu__c: true,
                    product_subcategory__c: true,
                },
                where:{
                    sfid: id
                }
            });
            if(productDate)
            {
                const catDet = await prisma.product_category__c.findFirst({
                    where:{
                        sfid: productDate.product_category_lu__c
                    }
                });
                const subCatDet = await prisma.product_subcategory__c.findFirst({
                    where:{
                        sfid: productDate.product_subcategory__c
                    }
                });
                let obj = {
                    name: true,
                    sfid: true,
                    product_subcategory__c: true,
                    product_category_lu__c: true,
                    mrp__c: true,
                    image_url__c: true,
                    video_url__c: true,
                    select_cross_sell_product_category__c: true,
                    select_cross_sell_product_sub_category__c: true,
                    mop__c: true,
                    delivery_mode__c: true,
                    delivery_tat__c: true,
                    exchange__c: true,
                    stockkeepingunit: true,
                }
                if(subCatDet && subCatDet.name !=undefined && subCatDet.name == "Upskilling")
                {
                    obj.course_name__c = true;
                    obj.minimum_eligiblity__c = true;
                    obj.syllabus__c = true;
                    obj.highlights_of_the_course__c = true;
                    obj.alumni__c = true;
                    obj.placements__c = true;
                    obj.application_deadline__c = true;
                    obj.admission_process__c = true;
                    obj.course_type__c = true;
                    obj.educator_faculty_details__c = true;
                    obj.payment_structure__c = true;
                    obj.minimum_payment__c = true;
                    obj.fee_structure__c = true;
                    obj.image_of_the_institute__c = true;
                    obj.take_trial_classes__c = true;
                    obj.course_outline__c = true;
                    obj.course_duration__c = true;
                    obj.language__c = true;
                    obj.start_date__c = true;
                    obj.learning_format__c = true;
                    obj.course_url__c = true;
                    obj.career_options__c = true;
                    obj.success_stories__c = true;
                    
                }else if(subCatDet && subCatDet.name !=undefined && subCatDet.name == "Test Preparation")
                {
                    obj.exam_name__c = true;
                    obj.class_timings__c = true;
                    obj.take_trial_classes__c = true;
                    obj.educator_faculty_details__c = true;
                    obj.highlights_of_the_course__c = true;
                    obj.course_outline__c = true;
                    obj.course_duration__c = true;
                    obj.course_type__c = true;
                    obj.image_of_the_institute__c = true;
                    obj.language__c = true;
                    obj.fee_structure__c = true;
                    obj.batch_start_date__c = true;
                    obj.about_the_test__c = true;
                    obj.current_previous_student_testimonials__c = true;
                    obj.learning_format__c = true;
                    obj.success_stories__c = true;
                    obj.course_url__c = true;
                    obj.career_options__c = true;
                    obj.payment_structure__c = true;
                    obj.minimum_payment__c = true;
                    obj.alumni__c = true;
                    obj.placements__c = true;
                }else if(subCatDet && subCatDet.name !=undefined && subCatDet.name == "University Courses")
                {
                    obj.programmes_offered__c = true;
                    obj.course_name__c = true;
                    obj.entrance_exam_details__c = true;
                    obj.naac_ratings__c = true;
                    obj.about_the_college__c = true;
                    obj.highlights_of_the_course__c = true;
                    obj.alumni__c = true;
                    obj.placements__c = true;
                    obj.admission_process__c = true;
                    obj.fee_structure__c = true;
                    obj.payment_structure__c = true;
                    obj.minimum_payment__c = true;
                    obj.course_outline__c = true;
                    obj.course_duration__c = true;
                    obj.success_stories__c = true;
                    obj.programme_type__c = true;
                    obj.language__c = true;
                    obj.course_type__c = true;
                    obj.scholarships_available__c = true;
                    obj.sponsorship_details__c = true;
                    obj.scholarships_details__c = true;
                    obj.institutes_s_website__c = true;
                }else if(subCatDet && subCatDet.name !=undefined && (subCatDet.name == "Tablet" || subCatDet.name == "Mobile" || subCatDet.name == "Laptop"))
                {
                 //   obj.brand__c = true;
                    obj.merchant_name__c = true;
                    obj.seller_information__c = true;
                    obj.model_name_number__c = true;
                    obj.series__c = true;
                    obj.graphics__c = true;
                    obj.generation__c = true;
                    obj.cache__c = true;
                    obj.core__c = true;
                    obj.screen_size__c = true;
                    obj.storage_size__c = true;
                    obj.memory__c = true;
                    obj.ram__c = true;
                    obj.ssd__c = true;
                    obj.ram_bus_speed__c = true;
                    obj.operating_system__c = true;
                    obj.battery__c = true;
                    obj.network_support__c = true;
                    obj.processor__c = true;
                    obj.overview_of_the_product__c = true;
                    obj.warranty_available__c = true;
                    obj.url__c = true;
                    obj.color__c = true;
                    obj.product_rating__c = true;
                    obj.package_inclusion__c = true;
                    obj.utility__c = true;
                    obj.camera_specifications__c = true;
                    obj.keyboard_specifications__c = true;
                    obj.display_specifications__c = true;
                    obj.connectivity_specifications__c = true;
                    obj.dimensions__c = true;
                    obj.weight__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name == "EV")
                {
                 //   obj.brand__c = true;
                    obj.model_name_number__c = true;
                    obj.seller_information__c = true;
                    obj.manufacturer_information__c = true;
                    obj.battery_voltage__c = true;
                    obj.transmission__c = true;
                    obj.battery_type__c = true;
                    obj.city_speed_limit__c = true;
                    obj.driving_range_per_charge__c = true;
                    obj.battery_capacity__c = true;
                    obj.charging_time__c = true;
                    obj.max_speed__c = true;
                    obj.acceleration__c = true;
                    obj.motor_power__c = true;
                    obj.motor_type__c = true;
                    obj.max_tourque__c = true;
                    obj.drive_type__c = true;
                    obj.starting__c = true;
                    obj.brake_type__c = true;
                    obj.charging_point__c = true;
                    obj.fast_charging__c = true;
                    obj.fast_charging_time__c = true;
                    obj.colors__c = true;
                    obj.internet_connectivity__c= true;
                    obj.operating_system__c = true;
                    obj.processor__c = true;
                    obj.mobile_application__c = true;
                    obj.mobile_connectivity__c = true;
                    obj.speedometer__c = true;
                    obj.tripmeter__c = true;
                    obj.console__c = true;
                    obj.pass_switch__c = true;
                    obj.clock__c = true;
                    obj.anti_theft_alarm__c = true;
                    obj.display__c = true;
                    obj.chassis__c = true;
                    obj.body_type__c = true;
                    obj.front_suspension__c = true;
                    obj.rear_suspension__c = true;
                    obj.mobile_charger__c = true;
                    obj.central_lock__c = true;
                    obj.loading_capacity__c = true;
                    obj.boot_space__c = true;
                    obj.tyre_type__c = true;
                    obj.tyre_size__c = true;
                    obj.ex_showroom_price__c = true;
                    obj.seating_capacity__c = true;
                    obj.length__c = true;
                    obj.width__c = true;
                    obj.height__c = true;
                    obj.ground_clearance__c = true;
                    obj.wheelbase__c = true;
                    obj.warranty_available__c = true;
                    obj.headlight__c = true;
                    obj.tail_light__c = true;
                    obj.turn_signal_lamp__c = true;
                    obj.low_battery_indicator__c = true;
                    obj.wheel_size__c = true;
                    obj.wheel_size__c = true;
                    obj.wheels_type__c = true;
                    obj.front_brake__c = true;
                    obj.rear_brake__c = true;
                    obj.front_brake_diameter__c = true;
                    obj.rear_brake_diameter__c = true;
                    obj.registration_required__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name == "Two Wheelers")
                {
                  //  obj.brand__c = true;
                    obj.seller_information__c = true;
                    obj.manufacturer_information__c = true;
                    obj.model_name_number__c = true;
                    obj.model_name_number__c = true;
                    obj.displacement__c = true;
                    obj.torque__c = true;
                    obj.motor_power__c = true;
                    obj.wheel_size__c = true;
                    obj.max_weight_load__c = true;
                    obj.ignition__c = true;
                    obj.tank_capacity__c= true; 
                    obj.mileage__c = true;
                    obj.city_speed__c = true;
                    obj.warranty_available__c = true;
                    obj.vehicle_body_type__c = true;
                    obj.speed_range__c = true;
                    obj.wheel_size__c = true;
                    obj.seller_information__c = true;
                    obj.manufacturer_information__c = true;
                    obj.speedometer__c = true;
                    obj.light__c = true;
                    obj.suspensions__c = true;
                    obj.breaks__c = true;
                    obj.central_lock__c = true;
                    obj.anti_theft_alarm__c = true;
                    obj.loading_capacity__c = true;
                    obj.tyre__c = true;
                    obj.ex_showroom_price__c = true;
                    obj.colors__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name == "Two Wheelers")
                {
                    obj.manufacturer_information__c = true;
                    obj.seller_information__c = true;
                 //   obj.brand__c = true;
                    obj.model_name_number__c = true;
                    obj.series__c = true;
                    obj.transmission__c = true;
                    obj.fuel_type__c = true;
                    obj.mileage__c = true;
                    obj.engine__c = true;
                    obj.bhp_max_power__c = true;
                    obj.body_type__c = true;
                    obj.torque__c = true;
                    obj.seating_capacity__c = true;
                    obj.boot_space__c = true;
                    obj.key_features__c = true;
                    obj.charging_time__c = true;
                    obj.suspension_steering_and_breaks__c = true;
                    obj.dimensions_and_capacity__c = true;
                    obj.comfort_and_convienience__c = true;
                    obj.interior__c = true;
                    obj.exterior__c = true;
                    obj.safety__c = true;
                    obj.entertainment_and_communication__c = true;
                    obj.colors__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name == "Television")
                {
                  //  obj.brand__c = true;
                    obj.merchant_name__c = true;
                    obj.seller_information__c = true;
                    obj.type__c = true;
                    obj.model_name_number__c = true;
                    obj.series__c = true;
                    obj.graphics__c = true;
                    obj.generation__c = true;
                    obj.screen_size__c = true;
                    obj.screen_resolution__c = true;
                    obj.aspect_ratio__c = true;
                    obj.motion_rate__c = true;
                    obj.viewing_angle__c = true;
                    obj.usb_version__c = true;
                    obj.supported_audio_formats__c = true;
                    obj.supported_video_formats__c = true;
                    obj.supported_picture_formats__c = true;
                    obj.backlight__c = true;
                    obj.x4k_hdr__c = true;
                    obj.dolby_vision__c= true;
                    obj.hdr10__c = true;
                    obj.hlg__c = true;
                    obj.reality_flow__c = true;
                    obj.vivid_picture_engine__c = true;
                    obj.wide_color_gamut_ntsc__c = true;
                    obj.dci_p3__c = true;
                    obj.response_time__c = true;
                    obj.other_audio_features__c = true;
                    obj.audio_output_rms__c = true;
                    obj.speaker_system__c = true;
                    obj.dolby_digital_decoder__c = true;
                    obj.dts_virtual_x__c = true;
                    obj.dolby_atmos_passthrough_earc__c = true;
                    obj.connectivity_options__c = true;
                    obj.hdmi__c = true;
                    obj.usb__c = true;
                    obj.bluetooth__c = true;
                    obj.ethernet__c = true;
                    obj.av__c = true;
                    obj.optical__c = true;
                    obj.x3_5_mm__c = true;
                    obj.allm__c = true;
                    obj.e_arc__c = true;
                    obj.chromecast_built_in__c = true;
                    obj.wifi__c = true;
                    obj.operating_system__c = true;
                    obj.cpu_processor__c = true;
                    obj.graphic_processor_gpu__c = true;
                    obj.ram__c = true;
                    obj.ok_google__c = true;
                    obj.google_play_store__c = true;
                    obj.auto_low_latency_mode__c = true;
                    obj.x5_ms_input_lag_4k_60hz__c = true;
                    obj.universal_search__c = true;
                    obj.language_universe__c = true;
                    obj.kids_mode__c = true;
                    obj.smart_recommendations__c = true;
                    obj.user_center__c = true;
                    obj.live_channels__c = true;
                    obj.temperature__c = true;
                    obj.storage_temperature__c = true;
                    obj.humidity__c = true;
                    obj.relative_humidity__c = true;
                    obj.power_supply_voltage_hz__c = true;
                    obj.power_consumption__c = true;
                    obj.set_weight_without_stand__c = true;
                    obj.set_weight_with_stand__c = true;
                    obj.wall_mount__c = true;
                    obj.remote_control__c = true;
                    obj.user_manual__c = true;
                    obj.stand_x_2__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name == "Smart Wearables")
                {
                  //  obj.brand__c = true;
                    obj.manufacturer_information__c = true;
                    obj.seller_information__c = true;
                    obj.series__c = true;
                    obj.version__c = true;
                    obj.model_name_number__c = true;
                    obj.design__c = true;
                    obj.screen_size__c = true;
                    obj.screen_resolution__c = true;
                    obj.touch_type__c = true;
                    obj.size__c = true;
                    obj.weight__c = true;
                    obj.casing__c = true;
                    obj.os_platform__c = true;
                    obj.cpu_processor__c = true;
                    obj.internal_storage__c = true;
                    obj.ram__c = true;
                    obj.card_slot__c = true;
                    obj.sim_slot__c = true;
                    obj.wifi__c = true;
                    obj.nfc__c = true;
                    obj.bluetooth__c = true;
                    obj.usb__c = true;
                    obj.battery_capacity__c = true;
                    obj.charging_technology__c = true;
                    obj.body_protection__c = true;
                    obj.glass_technology__c = true;
                    obj.sensors_functions__c = true;
                    obj.audio__c = true;
                    obj.radio__c = true;
                    obj.speaker__c = true;
                    obj.microphone__c = true;
                    obj.camera_type__c = true;
                    obj.features__c = true;
                    obj.colors__c = true;
                    obj.other_details__c = true;
                    obj.package_contents__c = true;
                    obj.compatibility__c = true;
                }else if( subCatDet && subCatDet.name !=undefined && subCatDet.name =="School")
                {
                    obj.school_name__c = true;
                    obj.school_address__c = true;
                    obj.school_contact_details__c = true;
                    obj.affiliated_board__c = true;
                    obj.school_ownership__c = true;
                    obj.fee_structure__c = true;
                    obj.payment_structure__c = true;
                    obj.student_faculty_ratio__c = true;
                    obj.language_of_instruction__c = true;
                    obj.classes_offered__c = true;
                    obj.documents_required_for_admission__c = true;
                    obj.school_results__c = true;
                    obj.amenities_offered__c = true;
                    obj.alumni__c = true;
                    obj.parents_testimonials__c = true;
                    obj.hostel__c = true;
                    obj.institutes_s_website__c = true;
                    obj.batch_size__c = true;
                    obj.awards__c = true;
                    obj.key_notes__c = true;
                    obj.events__c = true;
                    obj.classes_offered__c = true;
                    obj.language__c = true;
                    obj.admission_criteria__c = true;
                    obj.documents_required_for_admission__c = true;
                }

                
                let fetchData = await prisma.product2.findFirst({
                    select: obj,
                    where:{
                        sfid: id
                    }
                });
                if(fetchData) {
                        let isFavorite = false;
                        if (user_id != "" && user_id != undefined)
                        {
                            const cust_id = Number(user_id);
                            const accountDet = await prisma.account.findFirst({
                                where: {
                                    id: cust_id,
                                }
                            });
                            if(accountDet)
                            {
                                await chekViewdProduct(accountDet.sfid, id);
                                const favDet =  await prisma.favorite_products__c.findFirst({
                                    where:{
                                        account__id: accountDet.sfid,
                                        product__id: fetchData.sfid,
                                    }
                                });
                                if(favDet)
                                {
                                    isFavorite = true
                                }
                            }
                        }
                        const init = {
                            method: 'POST'
                        };
                        const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
                        .then((response) => {
                                return response;
                        });
                        let token = '';
                        if(getdata && getdata.access_token)
                        {
                            token = getdata.access_token
                        }
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", "Bearer "+token);
                        myHeaders.append("content-type", "application/json");
                        const apiInit = {
                            method: 'GET',
                            headers: myHeaders,
                        };
                        const getImg = await prisma.contentversion.findMany({
                            where:{
                                firstpublishlocationid: fetchData.sfid
                            },
                            select:{
                                contentdocumentid: true
                            },
                            orderBy: {
                                id: 'asc',
                            },
                        });
                        const getContentData = await getContentImages(getImg, apiInit);
                        fetchData.images = getContentData;
                        fetchData.isFavorite = isFavorite;
                        fetchData.product_category__c = catDet && catDet.name?catDet.name:'';
                        fetchData.product_sub_category__c  = subCatDet && subCatDet.name?subCatDet.name:'';
                    return res.status(200).json({ status: 'success', message: "Success", data: fetchData})
                } else {
                    return res.status(200).json({ status: 'error', message: "Product is not found" })
                }
            }else {
                return res.status(200).json({ status: 'error', message: "Product is not found" })
            }
            
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

async function getContentImages(getData, apiInit) {
    return new Promise(async (resolve, reject) => {
        try {
            let imageData = [];
           if(getData)
           {
            await Promise.all(getData.map(async element => {
                const imgsfid = element && element.contentdocumentid?element.contentdocumentid:'';
                if(imgsfid)
                {
                    const getImgData = await prisma.contentdocument.findFirst({
                        where:{
                            sfid: imgsfid
                        }
                    });
                    if(getImgData)
                    {
                        const img = getImgData.latestpublishedversionid;
                        const getdata = await fetch(GET_DOCUMENT_BY_ID+img, apiInit).then((response) => response.json())
                        .then((response) => {
                                return response;
                        });
                        imageData.push(getdata);
                    }
                }
            }));
           }
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}


async function chekViewdProduct(user_id, product_id) {
    const checkPro = await prisma.viewed_products__c.findFirst({
        where:{
            account__id: user_id,
            product__id: product_id
        }
    });
    if(!checkPro)
    {
        await prisma.viewed_products__c.create({
            data:{
                account__id: user_id,
                product__id: product_id
            }
        });
    }
}


