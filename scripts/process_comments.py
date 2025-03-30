#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
处理comments.json文件，将其中的tag_details转换为层级化结构
层级关系: theme -> tag -> metrics
"""

import json
import os
from typing import Dict, List, Any

def restructure_tag_details(tag_details: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    将原始tag_details转换为新的层级结构
    
    原结构:
    tag_details:{
      "ux": [
        {
          "tag_name": "#HitRegistration",
          "sentiment_score": 0.4,
          "sentiment_label": "Mixed",
          "keywords": ["命中注册", "不准确", "偶尔"]
        }
      ]
    }
    
    新结构:
    tag_details:[
      {
        "theme": "ux",
        "tags": [
          {
            "name": "#HitRegistration", 
            "metrics": {
              "sentiment_score": 0.4,
              "sentiment_label": "Mixed",
              "keywords": ["命中注册", "不准确", "偶尔"]
            }
          }
        ]
      }
    ]
    """
    new_structure = []
    
    # 遍历每个theme (如: ux, story, risk)
    for theme, tags in tag_details.items():
        theme_obj = {
            "theme": theme,
            "tags": []
        }
        
        # 遍历theme下的每个tag
        for tag in tags:
            tag_obj = {
                "name": tag["tag_name"],
                "metrics": {}
            }
            
            # 提取metrics (sentiment_score, sentiment_label, keywords)
            for key, value in tag.items():
                if key != "tag_name":  # 跳过tag_name，已经单独存储
                    tag_obj["metrics"][key] = value
            
            # 添加处理好的tag到theme中
            theme_obj["tags"].append(tag_obj)
        
        # 添加处理好的theme到结果列表中
        new_structure.append(theme_obj)
    
    return new_structure

def process_comments(input_file: str, output_file: str) -> None:
    """处理comments.json文件并生成新结构"""
    try:
        # 读取原始JSON文件
        with open(input_file, 'r', encoding='utf-8') as f:
            comments = json.load(f)
        
        # 处理每条评论的tag_details
        for comment in comments:
            if "tag_details" in comment:
                comment["tag_details"] = restructure_tag_details(comment["tag_details"])
        
        # 写入新的JSON文件
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(comments, f, ensure_ascii=False, indent=2)
        
        print(f"处理完成! 已将重构后的数据保存到 {output_file}")
    
    except Exception as e:
        print(f"处理过程中发生错误: {str(e)}")

if __name__ == "__main__":
    input_file = "public/comments.json"
    output_file = "public/comments_restructured.json"
    
    if not os.path.exists(input_file):
        print(f"错误: 找不到输入文件 {input_file}")
    else:
        process_comments(input_file, output_file) 