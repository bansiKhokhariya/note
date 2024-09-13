import { NextResponse, NextRequest } from 'next/server';


const regionsST1: string[] = ['T1E', 'Europe', 'Latin', 'Asia', 'Other'];
const regionsST2: string[] = ['T1E', 'Latin', 'Europe', 'Asia', 'Africa', 'Oceania'];

// Function to get the appropriate regions based on strategy
const getRegionsForStrategy = (strategy: string): string[] => {
    switch (strategy) {
        case 'ST2':
            return regionsST2;
        default:
            return regionsST1;
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topicName, keywords, strategy }: { topicName: string, keywords: string, strategy: string } = body;

        // Extract the part of topicName before the first hyphen
        const mainTopic: string = topicName.split(' - ')[0].trim();

        // Split keywords and get the first one
        // const keywordList: string[] = keywords.split(',').map((kw: string) => kw.trim());

        // Create the base URL 
        const baseUrl: string = `${mainTopic.replace(/\s+/g, '-').toLowerCase()}`;

        // Define regions

        // const regions = getRegionsForStrategy(strategy);

        const regions: string[] = ['T1E', 'Europe', 'Latin', 'Asia', 'Other'];

        // Generate Domain Names (URLs) and CF Names (Titles) separately
        const domainNames = regions.map((region: string) => `${baseUrl}-${region.toLowerCase()}.site`);

        // Remove leading/trailing empty strings from the split result to avoid extra hyphens
        const topicParts = topicName.split(' - ').filter(part => part.trim() !== '');
        const cfNames = regions.map((region: string) => {
            // Reconstruct the title without trailing empty parts
            return topicParts.length > 1
                ? `${mainTopic} - [${region}] - ${topicParts.slice(1).join(' - ')}`
                : `${mainTopic} - [${region}]`;
        });

        // Return response including domainNames, cfNames, keywords, and topicName
        return NextResponse.json({ success: true, domainNames, cfNames, keywords, topicName });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
    }
}
