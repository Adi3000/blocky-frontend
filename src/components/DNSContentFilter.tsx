import {FC, useEffect, useState} from "react";
import {disableDNS, useDNSStatus} from "../utils/api";
import toast from "react-hot-toast";
import {IBlockingStatus} from "./BlockingStatus";
import {useMutation, useQueryClient} from "react-query";
import Countdown from "react-countdown";

export const DNSContentFilter: FC = () => {
    const { data } = useDNSStatus()
    const [ blockingTime, setBlockingTime ] = useState(0);
    const blockingData: IBlockingStatus = data

    const queryClient = useQueryClient()

    const mutationDNS = useMutation(
        async (value: string) => {
            return await disableDNS(value)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('dns')
            },
        }
    )

    useEffect(() => {
        console.log('data', data)
        setBlockingTime(data?.autoEnableInSec)
    }, [data])

    type Time = { display: string, value: string}
    const times: Time[] = [
        { display: '10 min', value: '10m'},
        { display: '30 min', value: '30m'},
        { display: '1 hour', value: '60m'},
        { display: '2 hours', value: '120m'}
    ]

    const renderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean}) => {
        if (completed) {
            // Render a completed state
            return <span>Blocky Enable</span>
        } else {
            // Render a countdown
            return <span>Time : {hours}h {minutes}m {seconds}s</span>;
        }
    };

    const BlockyEnableForm = () => {
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            try {
                /*const res = await dnsQuery({ ip, type })
                toast.success(`Query is ${res.data.responseType}`)*/
            } catch (error: any) {
                toast.error(error)
            }
        }
        return (
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded pt-6 pb-8 mb-4 px-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        <span>How long to disable blocky</span>
                    </label>
                    <div className="flex items-center justify-center">
                        <div className="inline-flex" role="group">
                            {times.map((time, index) => (
                                <button
                                    key={`button-time-${index}`}
                                    type="button"
                                    className="rounded inline-block px-4 py-2.5 mx-2 bg-sky-500 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                    onClick={() => mutationDNS.mutate(time.value)}
                                >
                                    {time.display}
                                </button>)
                            )}
                        </div>
                    </div>

                    <button type="submit"><Countdown date={Date.now() + blockingTime * 1000} renderer={renderer}/></button>
                </div>
            </form>
        )
    }

    const BlockyDisabledForm = () => {
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            try {
                /*const res = await dnsQuery({ ip, type })
                toast.success(`Query is ${res.data.responseType}`)*/
            } catch (error: any) {
                toast.error(error)
            }
        }
        return (
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded pt-6 pb-8 mb-4 px-4"
            >
                <div className="mb-4">
                    <button type="button">Enable DNS</button>
                </div>
            </form>
        )
    }

   return (
       <div className="flex-col ml-6">
           <div className="prose prose-lg prose-slate dark:prose-invert">
               <h2>Content Filtering</h2>
           </div>

           <div className="w-full max-w-xs">
               { blockingData ? <BlockyEnableForm /> : <BlockyDisabledForm /> }
           </div>
       </div>
   )
}