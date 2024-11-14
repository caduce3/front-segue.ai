import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import { DatePickerWithRange } from "@/components/date-ranger-picker";
import { Input } from "@/components/ui/input";

interface TrafegoTableFiltersProps {
    dateRange: { from: Date; to: Date };
    setDateRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
    utmCampaign: string;
    setUtmCampaign: React.Dispatch<React.SetStateAction<string>>;
    utmContent: string;
    setUtmContent: React.Dispatch<React.SetStateAction<string>>;
    utmSource: string;
    setUtmSource: React.Dispatch<React.SetStateAction<string>>;
}

const TrafegoTableFilters: React.FC<TrafegoTableFiltersProps> = ({ 
        dateRange, setDateRange, 
        utmCampaign, setUtmCampaign, 
        utmContent, setUtmContent,
        utmSource, setUtmSource
    }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center bg-[#18181B] rounded-lg" onClick={() => setIsOpen(true)}>
                    <span className="text-sm font-semibold mr-2">Filtros</span>
                    <Filter className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <div className="pt-1 pb-1 pr-0.5">
                    <p className="mb-2 text-sm font-bold">Data</p>
                    <DatePickerWithRange
                        className="w-full"
                        value={{ from: dateRange.from, to: dateRange.to }}
                        onChange={(range) => {
                            if (range?.from && range?.to) {
                                setDateRange({ 
                                    from: new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate(), 0, 0), // 00:00
                                    to: new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 23, 59) // 23:59
                                });
                            }
                        }}
                    />

                    <div>
                        <p className="mb-2 mt-4 text-sm font-bold">UTM Campaign</p>
                        <Input 
                            placeholder="UTM Campaign" 
                            className="rounded-xl font-thin" 
                            value={utmCampaign} 
                            onChange={(e) => setUtmCampaign(e.target.value)}
                        />
                    </div>

                    <div>
                        <p className="mb-2 mt-4 text-sm font-bold">UTM Content</p>
                        <Input 
                            placeholder="UTM Content" 
                            className="rounded-xl font-thin" 
                            value={utmContent} 
                            onChange={(e) => setUtmContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <p className="mb-2 mt-4 text-sm font-bold">UTM Source</p>
                        <Input 
                            placeholder="UTM Source" 
                            className="rounded-xl font-thin" 
                            value={utmSource} 
                            onChange={(e) => setUtmSource(e.target.value)}
                        />
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TrafegoTableFilters;
