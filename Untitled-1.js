/**
 * $match: Tìm kiếm theo điều kiện
 * $count: Tổng số bản ghi 
 */

[
  {
    $match: {
      field_name: 'Giá trị muốn tìm kiếm'
    },
  },
  {
    $count: "Tên field"
  }
]

/**
 * $project: Loại bỏ các filed khi trả về dữ liệu, mặc định sẽ có _id
 * 
 */
[
  {
    $project: {
      _id: "0/false hoặc 1/true",
    }
  }
]

/**
 * $lookup: Dùng để select join giữa các collection
 * Nó sẽ trả về dạng array 
 */
[
  {
    $lookup: {
      from: 'Tên bảng cần join',
      localField: 'ID của bảng hiện tại',
      foreignField: 'ID của bảng này là khóa ngoại của bảng cần join',
      as: "New_Field_Name"
    }
  }
]


/**
 * Dùng để transfer array -> object
 */

[
  {
    $lookup: {
      from: 'Tên bảng cần join',
      localField: 'ID của bảng hiện tại',
      foreignField: 'ID của bảng này là khóa ngoại của bảng cần join',
      as: "New_Field_Name"
    }
  },
  {
    $addFields: {
      "New_Field_Name": {
        $arrayElemAt: ["$New_Field_Name", "Vị trí phần tử trong mảng"]
      }
    },
    // $addFields: {
    //   "New_Field_Name": {
    //     "$first": "$New_Field_Name"
    //   }
    // }
  }
]

/**
 * $average: Tính giá trị trung bình 
 */

[
  {
    $group: {
      _id: null, // null: Ko group dựa theo field nào cả. Ngược lại nếu _id: "$Field_Name" thì sẽ group theo tên field đó.
      "Tên_Field": {
        $avg: "$Field_Name" //Field_Name: Là tên 1 field trong collections.
      },
      "Tên_Field": {
        $sum: 1 // Dùng để tính tống số lượng document trong mỗi nhóm giựa vào điều kiện $groups
      }
    }
  }
]

/**
 * $group: Nếu document có dạng object
 * Với data
 */
[
  {
    "index": NumberInt(0),
    "name": "Aurelia Gonzales",
    "isActive": false,
    "registered": ISODate("2015-02-11T04:22:39+0000"),
    "age": NumberInt(20),
    "gender": "female",
    "eyeColor": "green",
    "favoriteFruit": "banana",
    "company": {
      "title": "YURTURE",
      "email": "aureliagonzales@yurture.com",
      "phone": "+1 (940) 501-3963",
      "location": {
        "country": "USA",
        "address": "694 Hewes Street"
      }
    },
    "tags": [
      "enim",
      "id",
      "velit",
      "ad",
      "consequat"
    ]
  }
]

// TODO: Tìm quốc gia có tổng số lượt người dùng đăng kí nhiều nhất
[
  {
    $group: {
      _id: "$company.location.country",
      userRegistered: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      "userRegistered": 1
    }
  },
  {
    $limit: 1
  }
]

// TODO: Tìm tổng số trung bình của tất cả các tags
[
  {
    $unwind: "$tags"
  },
  {
    $group: {
      _id: "$_id",
      averageTag: {
        $sum: 1
      }
    }
  },
  {
    $group: {
      _id: null,
      avgTag: {
        $avg: "$averageTag"
      }
    }
  }
]

// Hoặc
[
  {
    $addFields: {
      totalTag: {
        $size: { $ifNull: ["$tags", []] }
      }
    }
  },
  {
    $group: {
      _id: null,
      avgTag: {
        $avg: "$totalTag"
      }
    }
  }
]

// TODO: Tìm tổng số người dùng có sử dụng tag là 'enim' 
[
  {
    $match: {
      tags: "enim"
    }
  },
  {
    $count: "totalUseTag"
  }
]

// TODO: tên và tuổi của những người dùng không hoạt động và có thẻ velit là gì?
[
  {
    $match: {
      $and: [
        { isActive: false },
        { tags: "velit" }
      ]
    }
  }
]

// Tìm tổng số người dùng có phone là: "+1 (940)"
[
  {
    $match: {
      "company.phone": {
        $regex: "^\\+1 \\(940\\)"
      }
    }
  },
  {
    $count: "totalUserPhone"
  }
]

// TODO: Tìm tổng số người có 'ad' vị trí thứ 2 trong tags
[
  {
    $match: {
      "tags.1": "ad"
    }
  }
]

//  TODO: Tìm người dùng có tags là "enim", "id"
[
  {
    $match: {
      tags: { $all: ["enim", "id"] }
    }
  }
]