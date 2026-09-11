import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest, { params }: { params: { section: string } }) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const { arrayName, item } = await req.json();
    if (!arrayName || !item) {
      return NextResponse.json({ success: false, error: "Missing arrayName or item" }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const doc = await db.collection(params.section).findOne({ slug: "main" });
    if (!doc) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
    }
    const arr = doc[arrayName] || [];
    const newItem = { id: Date.now(), ...item };
    arr.push(newItem);
    await db.collection(params.section).updateOne(
      { slug: "main" },
      { $set: { [arrayName]: arr } }
    );
    return NextResponse.json({ success: true, data: arr });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ success: false, error: "Failed to add item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { section: string } }) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const { arrayName, itemId, updatedItem } = await req.json();
    if (!arrayName || itemId === undefined || !updatedItem) {
      return NextResponse.json({ success: false, error: "Missing arrayName, itemId or updatedItem" }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const doc = await db.collection(params.section).findOne({ slug: "main" });
    if (!doc) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
    }
    const arr = doc[arrayName] || [];
    let index = arr.findIndex((item: any) => item.id === itemId);
    if (index === -1 && typeof itemId === "number") {
      index = itemId < arr.length ? itemId : -1;
    }
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    arr[index] = { ...arr[index], ...updatedItem };
    await db.collection(params.section).updateOne(
      { slug: "main" },
      { $set: { [arrayName]: arr } }
    );
    return NextResponse.json({ success: true, data: arr });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { section: string } }) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const { arrayName, itemId } = await req.json();
    if (!arrayName || itemId === undefined) {
      return NextResponse.json({ success: false, error: "Missing arrayName or itemId" }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const doc = await db.collection(params.section).findOne({ slug: "main" });
    if (!doc) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
    }
    const arr = doc[arrayName] || [];
    let index = arr.findIndex((item: any) => item.id === itemId);
    if (index === -1 && typeof itemId === "number") {
      index = itemId < arr.length ? itemId : -1;
    }
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    const newArr = arr.filter((_: any, i: number) => i !== index);
    await db.collection(params.section).updateOne(
      { slug: "main" },
      { $set: { [arrayName]: newArr } }
    );
    return NextResponse.json({ success: true, data: newArr });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
