import { NextRequest, NextResponse } from "next/server";
import { addItemToArray, updateItemInArray, deleteItemFromArray, SiteData } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { section: keyof SiteData } }) {
    const token = req.cookies.get("admin_token")?.value;
    if (token !== "authenticated") {
        return NextResponse.json({ success: false }, { status: 401 });
    }
    try {
        const { arrayName, item } = await req.json();
        if (!arrayName || !item) {
            return NextResponse.json({ success: false, error: "Missing arrayName or item" }, { status: 400 });
        }
        const updatedData = addItemToArray(params.section, arrayName, item);
        return NextResponse.json({ success: true, data: updatedData[params.section] });
    } catch (error) {
        console.error("Error adding item:", error);
        return NextResponse.json({ success: false, error: "Failed to add item" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { section: keyof SiteData } }) {
    const token = req.cookies.get("admin_token")?.value;
    if (token !== "authenticated") {
        return NextResponse.json({ success: false }, { status: 401 });
    }
    try {
        const { arrayName, itemId, updatedItem } = await req.json();
        if (!arrayName || itemId === undefined || !updatedItem) {
            return NextResponse.json({ success: false, error: "Missing arrayName, itemId or updatedItem" }, { status: 400 });
        }
        const updatedData = updateItemInArray(params.section, arrayName, itemId, updatedItem);
        return NextResponse.json({ success: true, data: updatedData[params.section] });
    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { section: keyof SiteData } }) {
    const token = req.cookies.get("admin_token")?.value;
    if (token !== "authenticated") {
        return NextResponse.json({ success: false }, { status: 401 });
    }
    try {
        const { arrayName, itemId } = await req.json();
        if (!arrayName || itemId === undefined) {
            return NextResponse.json({ success: false, error: "Missing arrayName or itemId" }, { status: 400 });
        }
        const updatedData = deleteItemFromArray(params.section, arrayName, itemId);
        return NextResponse.json({ success: true, data: updatedData[params.section] });
    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
    }
}
